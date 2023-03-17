import { allSteps } from "./commands"
import { TIMEOUT } from "./enum"
import { logger } from "./logger"
import fb from './database/firebase'
import { OperatorStruct } from './commands.types'

let timeout:NodeJS.Timeout

export const startTimer = (cb: ()=>unknown) => {
	timeout = setTimeout(() => {
		cb()
	}, TIMEOUT)
}

/**
 * NUEVO TIPO DE OPERACION
 */

/**
 * Instancia de operacion temporal. Se crea al iniciar los pasos de cualquier comando.
 * 
 * Se hace escencialmente para individualizar las operaciones entre usuarios.
 */
class Operation {

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

