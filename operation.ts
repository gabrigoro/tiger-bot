import { OperationType, Transaction, Operation, TIMEOUT } from "./enum"

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