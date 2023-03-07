import { Telegraf, Context } from 'telegraf'
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram'
import { getAllUsers } from './database'
import * as commands from './commands'
import { start } from './commands/start'
import { version } from './package.json'
import { logger } from './logger'
import { BotStatus } from './enum'
dotenv.config()

let botStatus:BotStatus = 'offline'

if (!process.env.BOT_TOKEN) throw 'Bot token requerido'

const bot = new Telegraf<Context<Update>>(process.env.BOT_TOKEN)

const broadcastMessage = (message:string) => {
    getAllUsers().then((users) => {
        for (const user of users) {
            bot.telegram.sendMessage(user.id, message)
        }
    })
}

export async function startBot():Promise<BotStatus> {
    /** Emitir la nueva version a todos los chats */
    // broadcastMessage('Iniciado con version ' + version)

    /** Escuchar texto especifico */
    // bot.hears()

    bot.start(start)
    bot.help(commands.help)
    bot.settings(commands.settings)

    for (const command of commands.list) {
        bot.command(command.name, command.procedure)
    }

    // bot.on('callback_query', commands.callbackMaster)
    bot.on('text', commands.textReceiver)
    bot.on('sticker', ctx => ctx.reply('No me envies stickers no los entiendo'))

    /**
     * Agrega los comandos a un menu facil de usar.
     * El comando tiene que empezar con una `/`, tiene
     * que existir y tiene que declararse de antemano.
     */
    bot.telegram.setMyCommands(commands.list.map((command) => ({
        command: command.invocator,
        description: command.description
    })))

    logger.info('Starting bot')
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    
    botStatus = 'online'

    bot.launch().catch((reason) => {
        if (reason.response.error_code === 409) logger.error('Another instance took control')
        logger.info('Gracefully stoping...')
        botStatus = 'offline'
    })
    return botStatus
}

export async function stopBot() {
    botStatus = 'offline'
    logger.info('Stopping bot')
    try {
        bot.stop()
    } catch (error) {
        logger.error('Error stopping bot')
    }
    return botStatus
}

export function getBotStatus() {
    return botStatus
}