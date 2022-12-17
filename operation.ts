import { OperationType } from "./enum"

const transaction = {
	step: 0,
	amount: 0,
	to: '',
}

/** Iniciar una nueva operacion */
export const newOperation = (type: OperationType) => {
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