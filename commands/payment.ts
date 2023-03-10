import { Markup } from "telegraf"
import { ContextParameter } from "../commands"
import { OperationType } from "../enum"
import { getAmount, increaseStep, isCurrentStep, newOperation, setAmount, setTarget, startTimer } from "../operation"

const capitalize = (str:string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const categorias = [
	['comida', 'regalo', 'ocio'],
	['compras', 'personal', 'otro']
]

export const listaCategorias = categorias.map((fila) => {
	return fila.map((cat) => ({
		text: capitalize(cat),
		callback_data: cat
	}))
})

export const pago = (ctx:ContextParameter) => {
	const username = ctx.chat.id.toString()
    newOperation(OperationType.Payment, username)

    ctx.reply('Elegir la categoria del pago', Markup.inlineKeyboard(listaCategorias))
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