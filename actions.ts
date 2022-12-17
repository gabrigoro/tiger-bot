import { Context } from "telegraf"
import { addTransaction, getDebtsToPerson, getTotalPayments } from "./database"
import { OperationType, Transaction } from "./enum"
import store from "./store"

export const processMessage = (message:string, reply:(txt:string)=>void) => {
    if (!store.running && !Boolean(process.env.TESTING)) return reply('Deberias iniciar la app con /start')
    const list = message.split(' ')
    const [ , monto, detalle ] = list

    const common = {
        Trenes: () => reply('Tan todos cortados'),

        Pago: () => {
            if (!monto || !detalle) return reply('Pago <monto> <detalle>')
            addTransaction(OperationType.Payment, {
                amount: parseInt(monto),
                date: (new Date()).toDateString(),
                debt: false,
                from: 'me',
                to: detalle
            })
            const pagosTotal = getTotalPayments()
            return reply(`👍\nLlevas gastando $${pagosTotal}`)
        },

        Debo: () => {
            if (!monto || !detalle) return reply('Debo <monto> <sujeto>')
            addTransaction(OperationType.Debt, {
                amount: parseInt(monto),
                date: (new Date()).toDateString(),
                debt: true,
                from: 'me',
                to: detalle
            })
            const deboTotal = store.database[OperationType.Debt].reduce((acc, curr) => curr.amount + acc, 0)
            return reply(`👍\nDebes $${deboTotal}`)
        },

        Deben: () => {
            if (!monto || !detalle) return reply('Deben <monto> <sujeto>')
            addTransaction(OperationType.Owe, {
                amount: parseInt(monto),
                date: (new Date()).toDateString(),
                debt: true,
                from: detalle,
                to: 'me'
            })
            const debenTotal = store.database[OperationType.Owe].reduce((acc, curr) => curr.amount + acc, 0)
            return reply(`👍\nTe deben $${debenTotal}`)
        },

        Saldo: () => {
            if (!monto || !detalle) return reply('Saldo <monto> <sujeto>')
            const totalDebt = getDebtsToPerson(detalle)
            addTransaction(OperationType.Payment, {
                amount: parseInt(monto),
                date: (new Date()).toDateString(),
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
            return reply('Saldaste nosecuanto')
        case 'Saldan':
            return reply('Saldaron nosecuanto')
        default:
            return reply('No conozco')
    }
}