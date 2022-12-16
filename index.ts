import { Telegraf, Context, Markup } from 'telegraf'
import fetch from 'node-fetch'
import store from './store'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { addTransaction, start } from './database'
import { processMessage } from './actions'
import { OperationType, MINUTE } from './enum'
import { getStep, increaseStep, newOperation, resetStep } from './operation'
dotenv.config()

if (!process.env.BOT_TOKEN) throw 'Bot token requerido'

const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN)


bot.start(async (context) => {
    if (store.running) return context.reply('Ya esta iniciado')
    store.running = true
    start()
    
    context.reply('Inicio intervalo')

    setInterval(() => {
        const date = new Date()
        const hours = date.getHours()
        const minute = date.getMinutes()
        if (hours === 9 && minute === 0) context.reply('Ayer gastaste...')
    }, MINUTE)
})

bot.command('pago', (ctx) => {
    newOperation(OperationType.Payment)

    const fran = {
        text: 'Fulano',
        callback_data: 'fulano'
    }

    ctx.reply('Elegir la categoria del pago', {
        reply_markup: {
            inline_keyboard: [[fran, fran,fran]],
        }
    })
})

bot.on('callback_query', async (ctx) => {
    const { data } = (await ctx.callbackQuery) as {data:string}

    if (data === 'fulano') {
        increaseStep()
        return ctx.reply('Que monto pagaste?', {
            reply_markup: {
                force_reply: true,
                one_time_keyboard: true,
            }
        })
    }
    
    if (data === 'guardar') return ctx.reply('💸')
})

let amount = 0
let target = ''

bot.on('text', (ctx) => {
    const { text, reply_to_message } = ctx.message

    if (getStep() === 1) {
        increaseStep()
        amount = parseInt(text) || 0
        return ctx.reply('Destino?', {
            reply_markup: {
                force_reply: true,
                one_time_keyboard: true,
            }
        })
    }

    if (getStep() === 2) {
        resetStep()
        target = text
        return ctx.reply(`Pagaste ${amount} a ${target} ✔`, {
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Guardar',
                    callback_data: 'guardar'
                }]]
            }
        })
    }
})

bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))
/**
 * https://core.telegram.org/bots/features#global-commands
 * Telegram recomienda usar `Global Commands` para
 * interacciones consistentes para bots. 
 * /start, /help y /settings
 */

/**
 * Agrega los comandos a un menu facil de usar.
 * El comando tiene que empezar con una `/`, tiene
 * que existir y tiene que declararse de antemano.
 */
bot.telegram.setMyCommands([
    {
        command: '/pago',
        description: 'Anotar un pago'
    }
])

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));