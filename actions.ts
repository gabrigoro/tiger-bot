import { Context } from "telegraf"
import { addTransaction, getDebtsToPerson } from "./database"
import store, { Collection, Transaction } from "./store"


export const processMessage = (message:string, context:Context) => {
    if (!store.running) return context.reply('Deberias iniciar la app con /start')
    const list = message.split(' ')
    const [ , monto, detalle ] = list

    const common = {
        Trenes: () => context.reply('Tan todos cortados'),

        Pago: () => {
            if (!monto || !detalle) return context.reply('Pago <monto> <detalle>')
            addTransaction(Collection.payments, {
                amount: parseInt(monto),
                date: new Date(),
                debt: false,
                from: 'me',
                to: detalle
            })
            const pagosTotal = store.database[Collection.payments].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍\nLlevas gastando $${pagosTotal}`)
        },

        Debo: () => {
            if (!monto || !detalle) return context.reply('Debo <monto> <sujeto>')
            addTransaction(Collection.my_debts, {
                amount: parseInt(monto),
                date: new Date(),
                debt: true,
                from: 'me',
                to: detalle
            })
            const deboTotal = store.database[Collection.my_debts].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍\nDebes $${deboTotal}`)
        },

        Deben: () => {
            if (!monto || !detalle) return context.reply('Deben <monto> <sujeto>')
            addTransaction(Collection.others_debts, {
                amount: parseInt(monto),
                date: new Date(),
                debt: true,
                from: detalle,
                to: 'me'
            })
            const debenTotal = store.database[Collection.others_debts].reduce((acc, curr) => curr.amount + acc, 0)
            return context.reply(`👍\nTe deben $${debenTotal}`)
        },

        Saldo: () => {
            if (!monto || !detalle) return context.reply('Saldo <monto> <sujeto>')
            const totalDebt = getDebtsToPerson(detalle)
            addTransaction(Collection.payments, {
                amount: parseInt(monto),
                date: new Date(),
                debt: true,
                from: 'me',
                to: detalle
            })
        }

    }


    switch (list[0]) {
        case 'Trenes':
            return common.Trenes()
        case 'Pago':
            return common.Pago()
        case 'Debo':
            return common.Debo()
        case 'Deben':
            return common.Deben()
        case 'Saldo':
            return context.reply('Saldaste nosecuanto')
        case 'Saldan':
            return context.reply('Saldaron nosecuanto')
        default:
            return context.reply('No conozco')
    }
}