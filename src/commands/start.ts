import { ContextParameter } from "../commands.types"
import { addNewUser } from "../database/database"
import { ADMIN, ErrorCode } from "../enum"
import { logger } from "../logger"
import { getDate, getUserInfo } from "../utils/handlers"

export const start = async (ctx:ContextParameter) => {
	const userInfo = getUserInfo(ctx)

	if (userInfo.id === ADMIN) await ctx.reply('Hola administrador')
	
	addNewUser({
		id: userInfo.id,
		dateCreated: getDate(),
		name: userInfo.name,
		dolar: false
	})
	.then((res) => {
			ctx.reply('Bienvenido a Finanzas bot 🤠\nNuevo usuario registrado: ' + userInfo.name)
		})
		.catch((err) => {
			if (err === ErrorCode.Exists) {
				logger.error(`User ${userInfo.name} already exists`)
				return ctx.reply('Ya estas registrado')
			}

			// Error desconocido
			logger.error(`[command:start] ${err}`)
			ctx.reply('Error desconocido')
		})
		.finally(() => {
			ctx.reply('En este menu están los comandos disponibles y una descripción de cada uno\n⬇')
		})
}
