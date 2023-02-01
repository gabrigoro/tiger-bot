import { Telegraf, Context } from 'telegraf'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { getAllUsers } from './database'
import commands from './commands'
import { version } from './package.json'
dotenv.config()

if (!process.env.BOT_TOKEN) throw 'Bot token requerido'

const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN)

/**
 * Enviar un mensaje a cierto chat.
 */
const broadcastNewVersion = () => {
    getAllUsers().then((users) => {
        for (const user of users) {
            bot.telegram.sendMessage(user.id, 'Iniciado con version ' + version)
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
bot.command('eliminar', commands.eliminar)

// bot.on('callback_query', commands.callbackMaster)
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
    {
        command: '/eliminar',
        description: 'Eliminar una transaccion'
    },
])

bot.launch().catch((reason) => {
    if (reason.response.error_code === 409) console.log('Another instance took control')
    console.log('Gracefully stoping...')
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));