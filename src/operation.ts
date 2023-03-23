import { allSteps } from "./commands"
import { TIMEOUT } from "./enum"
import { logger } from "./logger"
import { ContextParameter, OperationName } from './commands.types'

let timeout:NodeJS.Timeout

export const startTimer = (cb: ()=>unknown) => {
	timeout = setTimeout(() => {
		cb()
	}, TIMEOUT)
}

/**
 * Instancia de operacion temporal. Se crea al iniciar los pasos de cualquier comando.
 * 
 * Se hace escencialmente para individualizar las operaciones entre usuarios.
 */
export class Operation {
	username: string
	operation: OperationName
	step: number
	isActive: boolean

	constructor(username:string, operation:OperationName) {
		this.username = username
		this.operation = operation
		this.isActive = true
		this.step = 0
		logger.info(`[operation:${this.username}] Starting new ${this.operation}`)
		// deberia empezar un timeout por aca
	}

	async nextStep(ctx:ContextParameter) {
		this.step++
		const selectedCommand = allSteps[this.operation]
		const currentCommand = selectedCommand[this.step]

		logger.info(`[operation:${this.username}] ${this.operation} step: ${this.step}`)
		currentCommand(ctx)
	}

	end(ctx:ContextParameter, reason?:string) {
		logger.info(`[operation:${this.username}] Closing ${this.operation}`)
		this.isActive = false
		ctx.reply(`Terminando operacion. Razon: ${reason || 'desconocida'}`)
	}
}