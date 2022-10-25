import { Telegraf, Context } from 'telegraf'
import fetch from 'node-fetch'
import store, { Collection } from './store'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { addTransaction, start } from './database'
import { processMessage } from './actions'
dotenv.config()

const MINUTO = 60000
const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN || '')


bot.start((context) => {
    if (store.running) return context.reply('Ya esta iniciado')
    store.running = true
    start()

    context.reply('Inicio intervalo')
    setInterval(() => {
        const date = new Date()
        const hours = date.getHours()
        const minute = date.getMinutes()
        if (hours === 7 && minute === 12) context.reply('Son las 7 y 12 che')
    }, MINUTO)
})
bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))
bot.on('text', (ctx) => processMessage(ctx.message.text, (txt) => {ctx.reply(txt)}))
bot.launch().then(() => console.log('Bot launched'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));