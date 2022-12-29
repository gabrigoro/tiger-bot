import { Markup } from "telegraf"
import { ContextParameter } from "../commands"
import { OperationType } from "../enum"
import { getAmount, isCurrentStep, newOperation, resetStep, setAmount } from "../operation"

export const ingreso = (ctx:ContextParameter) => {
	const username = ctx.chat.id.toString()
	newOperation(OperationType.Income, username)

    ctx.reply('Elegir la categoria del pago', Markup.inlineKeyboard([[
		{text: 'Sueldo', callback_data: 'sueldo'},
		{text: 'Regalo', callback_data: 'regalo'}
	]]))
}

export const incomeSteps = (ctx:ContextParameter) => {
    const { text } = ctx.message

	/** Obtener monto del pago */
	if (isCurrentStep(1)) {
		resetStep()
		const amount = parseInt(text) || 0
		setAmount(amount)
		return ctx.reply(`Recibiste ${getAmount()} ✔`, Markup.inlineKeyboard([[{
			text: 'Guardar',
			callback_data: 'guardar'
		}]]))
	}
}