import { Telegraf } from 'telegraf'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const MINUTO = 60000
const bot = new Telegraf(process.env.BOT_TOKEN)

const processMessage = (context) => {
    const { text } = context.message
    const list = text.split(' ')
    switch (list[0]) {
        case 'Trenes':
            context.reply('Tan todos cortados')
            break
        case 'Pago':
            if (!list[1] || !list[2]) {
                context.reply('Lo escribiste mal')
                break
            }
            context.reply(`$${list[1]} debido a ${list[2]}`)
            break
        case 'Debo':
            if (!list[1] || !list[2]) {
                context.reply('Lo escribiste mal')
                break
            }
            context.reply(`Debo $${list[1]} a ${list[2]}`)
            break
        default:
            context.reply('No conozco')
            break
    }
}

bot.

bot.start((context) => {
    context.reply('Inicio intervalo')
    setInterval(() => {
        const date = new Date()
        const hours = date.getHours()
        const minute = date.getMinutes()
        if (hours === 12 && minute === 12) context.reply('Son las 12 y 12 che')
    }, MINUTO)
})
bot.help(ctx => ctx.reply('Send me a sticker'))
bot.command('agregar', (context) => {
    console.log(context.telegram.callApi())
})
bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))
bot.on('text', processMessage)
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));