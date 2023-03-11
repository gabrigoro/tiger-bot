import { Telegraf, Context, Markup, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'typegram'
import { ContextParameter } from "./commands"
import { listaCategorias } from '../commands/payment'
import { OperationType, Transaction, Operation, TIMEOUT } from "./enum"
import { logger } from "./logger"
import fb from './firebase'

const transaction:Operation = {
	category: '',
	step: 0,
	amount: 0,
	to: '',
	date: 0,
	from: '',
	resolved: false,
	type: OperationType.Payment
}

let timeout:NodeJS.Timeout

export const startTimer = (cb: ()=>unknown) => {
	timeout = setTimeout(() => {
		closeOperation()
		cb()
	}, TIMEOUT)
}

/** Iniciar una nueva operacion */
export const newOperation = (type: OperationType, username:string) => {
	if (type === OperationType.Payment) transaction.from = username
	if (type === OperationType.Income) transaction.to = username
	transaction.type = type
	transaction.date = (new Date()).getTime()
	closeOperation()
}

export const closeOperation = () => {
	clearTimeout(timeout)
	resetAmount()
	resetStep()
}

export const getType = () => transaction.type

export const getAmount = () => transaction.amount

export const setAmount = (newAmount:number) => {
	transaction.amount = newAmount
}

export const setOrigin = (origin:string) => {
	transaction.from = origin
}

export const setTarget = (target:string) => {
	transaction.to = target
}

export const resetAmount = () => {
	transaction.amount = 0
}

export const getStep = () => transaction.step

export const increaseStep = () => {
	transaction.step++
}

export const isCurrentStep = (n:number) => getStep() === n

export const resetStep = () => transaction.step = 0

export const setCategory = (category:string) => {
	transaction.category = category
}

export const getTransaction = () => transaction as Transaction


/**
 * NUEVO TIPO DE OPERACION
 */

/** Tipos de operaciones */
type NewOperationType = 'payment' | 'feedback' | 'subscribe' | 'broadcast' | 'null'
type SimpleOperation = (ctx:ContextParameter) => void

type OperatorStruct = {
	command: NewOperationType
	isActive: boolean
	step: number
	start: (command:NewOperationType) => void
	nextStep: SimpleOperation
	end: () => void
}

type CommandsStepsList = {
	[key in NewOperationType]: SimpleOperation[]
}

/** 
 * Operador de comandos
 * @step 0: Comando sin empezar
 * @step 1: Comando seteado, esperando mensaje
 * @step 2...: Flujo normal
 */
export const Operator:OperatorStruct = {
	command: 'null',
	isActive: false,
	step: 0,
	start(command) {
		if (this.isActive) this.end()
		this.command = command
		this.isActive = true
		this.step = 1
		logger.info(`[operation] Starting new ${this.command}`)
	},
	nextStep(ctx) {
		if (this.step === 0) {
			return this.end()
		}

		const selectedCommand = allSteps[this.command]
		const currentCommand = selectedCommand[this.step]

		logger.info(`[command] ${currentCommand.name}`)
		currentCommand(ctx)
	},
	end() {
		logger.info(`[operation] Closing ${this.command}`)
		this.command = 'null'
		this.isActive = false
	}
}

/** Pasos de /feedback */
const feedbackSteps:SimpleOperation[] = [
	async function(ctx) {
		Operator.start('feedback')
		ctx.reply('Escribi tus comentarios en un solo mensaje:')
		// addNewAnonFeedback(ctx.chat.id.toString(), ctx.message.text)
	},
	async function(ctx) {
		const feedbackText = ctx.message.text
		logger.info(`[feedback] ${feedbackText}`)
		await ctx.reply('Tu mensaje:')
		await ctx.reply(feedbackText)
		await ctx.reply('Subiendo feedback')
		Operator.end()
	}
]

/** Pasos de /payment */
const paymentSteps:SimpleOperation[] = [
	async function(ctx) {
		Operator.start('payment')
		// const username = ctx.chat.id.toString()
		// newOperation(OperationType.Payment, username)
	
		// ctx.reply('Elegir la categoria del pago', Markup.inlineKeyboard(listaCategorias))
		// TODO: acordarse de generalizar el listado de categorias
		ctx.reply('Enviar pago con formato "<monto> <description>"')
	},
	async function(ctx) {
		const parts = ctx.message.text.split(' ')

		if (parts.length < 2) {
			logger.error('Incomplete command')
			ctx.reply('Comando incompleto')
			Operator.end()
			return 
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
	}
]

export const allSteps:CommandsStepsList = {
	null: [(ctx) => {
		Operator.end()
	}],
	payment: paymentSteps,
	feedback: feedbackSteps,
	broadcast: [(ctx) => {}],
	subscribe: [(ctx) => {}]
}