import { Telegraf, Context, Markup, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'typegram'
import { addNewUser, addTransaction, getExpenses } from './database';
import { ErrorCode, MINUTE, OperationType } from './enum';
import { getAmount, getTransaction, increaseStep, isCurrentStep, newOperation, resetStep, setAmount, setCategory } from './operation';

type ContextParameter = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>

const start = async (ctx:ContextParameter) => {
    const newUsername = ctx.chat.id

    addNewUser(newUsername.toString()).then((res) => {
        ctx.reply('Nuevo usuario registrado: ' + newUsername)
    }).catch((err) => {
        ctx.reply(err === ErrorCode.Exists ? 'Ya estas registrado':'Error desconocido')
    })
    

    setInterval(() => {
        const date = new Date()
        const hours = date.getHours()
        const minute = date.getMinutes()
        if (hours === 12 && minute === 0) ctx.reply('Ayer gastaste...')
    }, MINUTE)
}

const help = (ctx:ContextParameter) => {
	return ctx.reply('Nada de ayuda por ahora')
}

const settings = (ctx:ContextParameter) => {
	return ctx.reply('Ninguna configuracion por ahora')
}

const callbackMaster = async (ctx:NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>) => {
    const { data } = (await ctx.callbackQuery) as {data:string}

    if (data === 'fulano') {
        increaseStep()
        setCategory('fulano')
        return ctx.reply('Que monto pagaste?', Markup.forceReply())
    }
    
    /** Guardar en base de datos */
    if (data === 'guardar') {
        const buildTransaction = getTransaction()

        addTransaction(buildTransaction).then(() => {
            return ctx.reply('💸')
        }).catch((reason) => {
            console.log('Failed uploading', reason)
            return ctx.reply('Hubo un error guardando tu operacion')
        })

    }
}

const textReceiver = (ctx:ContextParameter) => {
    const { text } = ctx.message

    /** Obtener monto del pago */
    if (isCurrentStep(1)) {
        increaseStep()
        const amount = parseInt(text) || 0
        setAmount(amount)

        return ctx.reply('Destino?', Markup.forceReply())
    }

    /** Obtener destinatario del pago */
    if (isCurrentStep(2)) {
        resetStep()
        return ctx.reply(`Pagaste ${getAmount()} a ${text} ✔`, Markup.inlineKeyboard([[{
            text: 'Guardar',
            callback_data: 'guardar'
        }]]))
    }
}

const gastos = async (ctx:ContextParameter) => {
    await getExpenses('1174794170').then((data) => {
        const textBody = `Ultimos 7 dias: $${data.lastWeek}
Ultimos 30 dias: $${data.lastMonth}
Ultimos 365 dias: $${data.lastYear}`

        ctx.reply(textBody)
    })
}

const pago = (ctx:ContextParameter) => {
    newOperation(OperationType.Payment)

    const fran = {
        text: 'Fulano',
        callback_data: 'fulano'
    }

    ctx.reply('Elegir la categoria del pago', Markup.inlineKeyboard([[fran,fran,fran]]))
}

const ingreso = (ctx:ContextParameter) => {
	newOperation(OperationType.Income)


}

export default {
	start,
	help,
	settings,
	callbackMaster,
	textReceiver,
	gastos,
	pago,
	ingreso
}