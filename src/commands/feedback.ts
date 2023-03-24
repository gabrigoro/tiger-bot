import { sendMessageToUser } from "../botControl"
import { SimpleOperation } from "../commands.types"
import { addNewAnonFeedback } from "../database/database"
import { ADMIN, EndReason } from "../enum"
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
		const adminReceipt = `from: ${ctx.from.first_name} ${ctx.from.last_name}\nfeedback: ${feedbackText}`
		sendMessageToUser(ADMIN.toString(), adminReceipt)
		Operator.end(ctx, EndReason.OK)
	}
]
