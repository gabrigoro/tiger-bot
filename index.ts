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
            addTransaction(Collection.payments, {
                amount: parseInt(list[1]),
                date: new Date(),
                debt: false,
                from: 'me',
                to: list[2]
            })
            const pagosTotal = store.database[Collection.payments].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍.\nLlevas gastando $${pagosTotal}`)
        case 'Debo':
            if (!list[1] || !list[2]) return context.reply('Lo escribiste mal')
            addTransaction(Collection.my_debts, {
                amount: parseInt(list[1]),
                date: new Date(),
                debt: true,
                from: 'me',
                to: list[2]
            })
            const deboTotal = store.database[Collection.my_debts].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍.\nDebes $${deboTotal}`)
        case 'Deben':
            if (!list[1] || !list[2]) return context.reply('Lo escribiste mal')
            addTransaction(Collection.others_debts, {
                amount: parseInt(list[1]),
                date: new Date(),
                debt: true,
                from: list[2],
                to: 'me'
            })
            const debenTotal = store.database[Collection.others_debts].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍.\nTe deben $${debenTotal}`)
        default:
            return context.reply('No conozco')
    }
}

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
bot.help(ctx => ctx.reply('Send me a sticker'))
bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))
bot.on('text', (ctx) => processMessage(ctx.message.text, ctx))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));