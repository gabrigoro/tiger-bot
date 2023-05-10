import { ContextParameter } from "../commands.types"

/**
 * Devuelve la fecha entera en formato ISO.
 * La diferencia de zona horaria no esta contada.
 * @returns '2023-03-24 16:08:22.012 GMT-3'
 * @returns '2023-03-24 16:08:22.012'
 */
export function getDate() {
	const date = new Date()

	const isoDate = date.toISOString()
	// '2023-03-24T16:08:22.012Z'

	const onlyNumbersDate = isoDate.replace(/[TZ]/g, ' ')
	// '2023-03-24 16:08:22.012 '
	
	const timeOffsetDate = onlyNumbersDate + (process.env.TZ || '')
	// '2023-03-24 16:08:22.012 GMT-3'

	return timeOffsetDate.trim()
}

/**
 * Devuelve la id unica del chat y el nombre completo del usuario del chat
 */
export function getUserInfo(ctx:ContextParameter): {id:number, name:string} {
	return {
		id: ctx.chat.id,
		name: `${ctx.from.first_name} ${ctx.from.last_name}`
	}	
}