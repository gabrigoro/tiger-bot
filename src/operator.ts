import { OperatorStruct } from './commands.types'
import { EndReason } from './enum'
import { Operation } from './operation'

/** 
 * Operador de comandos
 * @step 0: Comando sin empezar
 * @step 1: Comando seteado, esperando mensaje
 * @step 2...: Flujo normal
 */
export const Operator:OperatorStruct = {
	/**
	 * Lista para mantener las operaciones actualmente vigentes.
	 * Mantiene guardada una operacion por usuario.
	 */
	buffer: {},
	start(ctx, command) {
		const username = ctx.chat.id.toString()
		if (this.buffer[username]?.isActive) this.buffer[username].end(ctx, 'iniciando una nueva')
		this.buffer[username] = new Operation(username, command)
	},
	async nextStep(ctx) {
		const username = ctx.chat.id.toString()
		this.buffer[username].nextStep(ctx)
	},
	end(ctx, reason) {
		const username = ctx.chat.id.toString()
		this.buffer[username].end(ctx, reason)
	}
}

