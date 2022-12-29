import { Markup } from "telegraf"
import { ContextParameter } from "../commands"
import { OperationType } from "../enum"
import { getAmount, increaseStep, isCurrentStep, newOperation, setAmount, setTarget, startTimer } from "../operation"

export const pago = (ctx:ContextParameter) => {
	const username = ctx.chat.id.toString()
    newOperation(OperationType.Payment, username)

    const fran = {
        text: 'Fulano',
        callback_data: 'fulano'
    }

    ctx.reply('Elegir la categoria del pago', Markup.inlineKeyboard([[fran,fran,fran]]))
}

export const paymentSteps = (ctx:ContextParameter) => {
    const { text } = ctx.message

	/** Obtener monto del pago */
	if (isCurrentStep(1)) {
		increaseStep()
		const amount = parseInt(text) || 0
		setAmount(amount)
	
		return ctx.reply('Destino?', Markup.forceReply())
	}
	
	/** Obtener destinatario del pago */
	if (isCurrentStep(2)) {
		setTarget(text)
		return ctx.reply(`Pagaste ${getAmount()} a ${text} ✔`, Markup.inlineKeyboard([[{
			text: 'Guardar',
			callback_data: 'guardar'
		}]])).then(() => {
			startTimer(() => ctx.reply('Tiempo caducado'))
		})
	}
}