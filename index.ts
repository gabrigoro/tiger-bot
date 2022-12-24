import { Telegraf, Context, Markup, NarrowedContext } from 'telegraf'
import { Message } from 'typegram'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { addNewUser, addTransaction, getAllUsers, getExpenses, getExpensesFromUser } from './database'
import { OperationType, MINUTE, Transaction, ErrorCode } from './enum'
import { getAmount, getStep, getTransaction, increaseStep, isCurrentStep, newOperation, resetStep, setAmount, setCategory } from './operation'
import commands from './commands'
import { version } from './package.json'
dotenv.config()

if (!process.env.BOT_TOKEN) throw 'Bot token requerido'

const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN)

/**
 * Enviar un mensaje a cierto chat.
 * Deberia guardar todos los chats ids en la base
 * y con un for loop crear un broadcast.
 */
const broadcastNewVersion = () => {
    getAllUsers().then((users) => {
        for (const user of users) {
            bot.telegram.sendMessage(user.id, 'Nueva version de bot ' + version)
        }
    })
}
broadcastNewVersion()

bot.start(commands.start)

bot.help(commands.help)

bot.settings(commands.settings)

bot.command('gastos', commands.gastos)

bot.command('pago', commands.pago)

bot.command('ingreso', commands.ingreso)

bot.on('callback_query', commands.callbackMaster)

bot.on('text', commands.textReceiver)

bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))

/**
 * Agrega los comandos a un menu facil de usar.
 * El comando tiene que empezar con una `/`, tiene
 * que existir y tiene que declararse de antemano.
 */
bot.telegram.setMyCommands([
    {
        command: '/pago',
        description: 'Anotar un pago'
    },
    {
        command: '/gastos',
        description: 'Ver gastos'
    },
    {
        command: '/ingreso',
        description: 'Anotar un ingreso'
    },

])

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));