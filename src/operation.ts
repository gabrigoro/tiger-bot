import { Telegraf, Context, Markup, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'typegram'
import { allSteps } from "./commands"
import { listaCategorias } from './commands/payment'
import { OperationType, Transaction, Operation, TIMEOUT } from "./enum"
import { logger } from "./logger"
import fb from './database/firebase'
import { OperatorStruct } from './commands.types'

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
	start(ctx, command) {
		if (this.isActive) this.end(ctx)
		this.command = command
		this.isActive = true
		this.step = 1
		logger.info(`[operation] Starting new ${this.command}`)
	},
	nextStep(ctx) {
		if (this.step === 0) {
			return this.end(ctx)
		}

		const selectedCommand = allSteps[this.command]
		const currentCommand = selectedCommand[this.step]

		logger.info(`[command] ${currentCommand.name}`)
		currentCommand(ctx)
	},
	end(ctx) {
		logger.info(`[operation] Closing ${this.command}`)
		this.command = 'null'
		this.isActive = false
	}
}

