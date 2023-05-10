import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
	while (level.length < 5) level += ' '
	return `${timestamp} [${level}] [${label}] ${message}`
})

export const logger = createLogger({
	format: combine(label({ label: 'Tiger' }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }), myFormat),
	transports: [new transports.Console(), new transports.File({ filename: 'history.log' })],
})
