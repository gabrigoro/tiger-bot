import { Telegraf, Context } from 'telegraf'
import fetch from 'node-fetch'
import store, { Collection } from './store'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { addTransaction, start } from './database'
dotenv.config()

const MINUTO = 60000
const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN || '')


const processMessage = (message:string, context:Context) => {
    if (!store.running) return context.reply('Deberias iniciar la app con /start')
    const list = message.split(' ')

    switch (list[0]) {
        case 'Trenes':
            return context.reply('Tan todos cortados')            
        case 'Pago':
            if (!list[1] || !list[2]) return context.reply('Lo escribiste mal')
            return context.reply(`$${list[1]} debido a ${list[2]}`)            
        case 'Debo':
            if (!list[1] || !list[2]) {
                return context.reply('Lo escribiste mal')                
            }
            return context.reply(`Debo $${list[1]} a ${list[2]}`)            
        default:
            return context.reply('No conozco')
    }
}

bot.start((context) => {
    store.running = true
    start()
    
    addTransaction(Collection.payments, {
        amount: 100,
        date: new Date(),
        debt: false,
        from: 'me',
        to: 'somebody'
    })

    context.reply('Inicio intervalo')
    setInterval(() => {
        const date = new Date()
        const hours = date.getHours()
        const minute = date.getMinutes()
        if (hours === 7 && minute === 12) context.reply('Son las 7 y 12 che')
    }, MINUTO)
})
bot.help(ctx => ctx.reply('Send me a sticker'))
bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))
bot.on('text', (ctx) => processMessage(ctx.message.text, ctx))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));