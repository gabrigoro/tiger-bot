import { OperationType } from "./enum"

export let step = 0

/** Iniciar una nueva operacion */
export const newOperation = (type: OperationType) => {
	resetStep()

}

export const getStep = () => step

export const increaseStep = () => step++

export const resetStep = () => step = 0