import { OperationType, Transaction, Operation } from "./enum"

const transaction:Operation = {
	category: '',
	step: 0,
	amount: 0,
	to: '',
	date: 0,
	from: '1174794170',
	resolved: false,
	type: OperationType.Payment
}

/** Iniciar una nueva operacion */
export const newOperation = (type: OperationType) => {
	transaction.type = type
	transaction.date = (new Date()).getTime()
	resetStep()
	resetAmount()
}

export const getAmount = () => transaction.amount

export const setAmount = (newAmount:number) => {
	transaction.amount = newAmount
}

export const resetAmount = () => {
	transaction.amount = 0
}

export const getStep = () => transaction.step

export const increaseStep = () => transaction.step++

export const isCurrentStep = (n:number) => getStep() === n

export const resetStep = () => transaction.step = 0

export const setCategory = (category:string) => {
	transaction.category = category
}

export const getTransaction = () => transaction as Transaction