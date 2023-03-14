import { Telegraf, Context, Markup, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'typegram'
import { incomeSteps, ingreso } from '../commands/income';
import { paymentSteps, pago } from '../commands/payment';
import { addNewAnonFeedback, addNewUser, addTransaction, getExpenses, getIncome } from './database/database';
import getDolarValue from './dolarAPI';
import { ErrorCode, MINUTE, OperationType, Transaction } from './enum';
import fb from './database/firebase'
import { logger } from './logger';
import { allSteps, closeOperation, getAmount, getTransaction, getType, increaseStep, isCurrentStep, newOperation, Operator, resetStep, setAmount, setCategory, setOrigin, setTarget, startTimer } from './operation';

export type ContextParameter = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>

export const help = (ctx:ContextParameter) => {
	return ctx.reply('Nada de ayuda por ahora')
}

export const settings = (ctx:ContextParameter) => {
	return ctx.reply('Ninguna configuracion por ahora')
}

export const callbackMaster = async (ctx:NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>) => {
    return
    const { data } = (await ctx.callbackQuery) as {data:string}

	/** Recibe una categoria */
    if (data !== 'guardar') {
        increaseStep()
        setCategory(data)
        return ctx.reply('Ingresa el monto', Markup.forceReply())
    }
    
    /** Guardar en base de datos */
    if (data === 'guardar') {
        const buildTransaction = getTransaction()
		closeOperation()
        addTransaction(buildTransaction).then(() => {
            return ctx.reply('💸')
        }).catch((reason) => {
            console.log('Failed uploading', reason)
            return ctx.reply('Hubo un error guardando tu operacion')
        })

    }
}

export const textReceiver = async (ctx:ContextParameter) => {
    Operator.nextStep(ctx)
    return
    const parts = ctx.message.text.split(' ')
    logger.info('[UserInput] ' + parts)
    const dolar = await getDolarValue()
    ctx.reply(`${dolar}`)
    if (parts.length < 2) {
        logger.error('Incomplete command')
        return ctx.reply('Comando incompleto')
    }
    
    if (parts[0].match(/[^a-z]/g)?.length) {
        // si la primera parte no tiene letras
        
        if (parts[1].match(/[a-z]/g)?.length) {
            // si la segunda parte tiene letras

            // si tiene un - no lo cuenta
            if (parts[0].includes('-')) {
                logger.error('"-" detected')
                return ctx.reply('No se admitem "-"')
            }
            
            // si numero contiene un + es un ingreso
            const esIngreso = parts[0].includes('+')
            const parseado = parseFloat(parts[0])
            const amount = esIngreso ? parseado : parseado * -1
            try {
                await fb.upload('gasto', {
                    monto: amount,
                    nombre: parts.slice(1, parts.length).join(' ') // array menos el primer elemento
                })
            } catch (err) {
                logger.error('Firebase push error')
                return ctx.reply('Hubo un error')
            }
            const gastos = await fb.getCollection<{monto:number, nombre:string}>('gasto')
            const suma = gastos.reduce((acc, curr) => acc + curr.monto, 0)
            logger.info(`${ctx.message.text}: OK`)
            return ctx.reply(`$${amount} OK. Fondos: $${suma.toFixed(2)}`)
        }
    }
    logger.error('Invalid')
    return ctx.reply('Invalido')

    // cosas de la version anterior de la app
	if (getType() === OperationType.Payment) return paymentSteps(ctx)
	if (getType() === OperationType.Income) return incomeSteps(ctx)
}

export const gastos = async (ctx:ContextParameter) => {
	const username = ctx.chat.id.toString()
	const expenses = await getExpenses(username)
	const income = await getIncome(username)
		
	const textBody = `Gastos
Ultimos 7 dias: $${expenses.lastWeek}
Ultimos 30 dias: $${expenses.lastMonth}
Ultimos 365 dias: $${expenses.lastYear}

Ingresos
Ultimos 7 dias: $${income.lastWeek}
Ultimos 30 dias: $${income.lastMonth}
Ultimos 365 dias: $${income.lastYear}

Fondos: $${income.total - expenses.total}`

	await ctx.reply(textBody)
}

const eliminar = async (ctx:ContextParameter) => {
    ctx.sendChatAction('typing')
    const paymentsList = await fb.getCollection<Transaction>('pago')
    const incomeList = await fb.getCollection<Transaction>('ingreso')
    const ops = [...paymentsList, ...incomeList].sort((a,b) => a.date - b.date)

    /** Si las transacciones son menos de 2, telegram no puede enviar un Poll con una sola opcion. */
    if (ops.length < 2) return ctx.reply(`${ops[0].date} ${ops[0].type} $${ops[0].amount}`)

    ctx.sendPoll('Transacciones', ops.map((op) => `${op.date} ${op.type} $${op.amount}`), Markup.inlineKeyboard([[{
        text: 'Cancelar',
        callback_data: 'cancelar'
    }]]))
}

type CommandType = {
    name: string
    invocator: string
    description: string
    procedure: (ctx:ContextParameter) => any
}

/**
 * Lista de comandos visualizados en la interfaz del chat de telegram. 
 * El atributo `invocator` siempre tiene que empezar con una `/`.
 */
export const list:CommandType[] = [
    {
        name: 'gastos',
        invocator: '/gastos',
        procedure: gastos,
        description: 'Anotar un pago'
    },
    {
        name: 'pago',
        invocator: '/pago',
        procedure: allSteps['payment'][0],
        description: 'Ver gastos'
    },
    {
        name: 'ingreso',
        invocator: '/ingreso',
        procedure: ingreso,
        description: 'Anotar un ingreso'
    },
    {
        name: 'eliminar',
        invocator: '/eliminar',
        procedure: eliminar,
        description: 'Eliminar una transaccion'
    },
    {
        name: 'feedback',
        invocator: '/feedback',
        procedure: allSteps['feedback'][0],
        description: 'Enviar comentarios al desarrollador'
    }
]