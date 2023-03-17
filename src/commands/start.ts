import { ContextParameter } from "../commands.types"
import { addNewUser } from "../database/database"
import { ErrorCode, MINUTE } from "../enum"
import { logger } from "../logger"

export const start = async (ctx:ContextParameter) => {
    const newUsername = ctx.chat.id

	await ctx.reply('Bienvenido a Finanzas bot 🤠')
	if (ctx.chat.id === 1174794170) await ctx.reply('Hola administrador')

	addNewUser(newUsername.toString())
		.then((res) => {
			ctx.reply('Nuevo usuario registrado: ' + newUsername)
		})
		.catch((err) => {
			if (err === ErrorCode.Exists) {
				logger.error(`User ${newUsername} already exists`)
				return ctx.reply('Ya estas registrado')
			}

			// Error desconocido
			logger.error(err)
			ctx.reply('Error desconocido')
		})
		.finally(() => {
			ctx.reply('En este menu están los comandos disponibles y una descripción de cada uno\n⬇')
		})
}
