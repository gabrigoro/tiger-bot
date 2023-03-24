import { sendMessageToUser } from "../botControl"
import { SimpleOperation } from "../commands.types"
import { addNewAnonFeedback } from "../database/database"
import { ADMIN } from "../enum"
import { logger } from "../logger"
import { Operator } from "../operator"

/** Pasos de /feedback */
export const feedbackSteps:SimpleOperation[] = [
	async function(ctx) {
		Operator.start(ctx, 'feedback')
		ctx.reply('Escribi tus comentarios en un solo mensaje:')
	},
	async function(ctx) {
		const feedbackText = ctx.message.text
		logger.info(`[feedback] ${feedbackText}`)
		await ctx.reply('Subiendo feedback')
		await addNewAnonFeedback(ctx.chat.id.toString(), feedbackText)
		sendMessageToUser(ADMIN.toString(), feedbackText)
		Operator.end(ctx)
	}
]
