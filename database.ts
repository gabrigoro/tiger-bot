import fs from 'fs'
import { OperationType, Transaction } from './enum'
import store, { Database } from './store'
const log = (str:string) => console.log('[database]', str)
const filename = store.testing ? './test-database.json' : './database.json'

export const start = () => {
    log('Starting database')
    if (fs.existsSync(filename)) {
        log('Reading existing database')
        const file = fs.readFileSync(filename, 'utf-8')
        try {
            const data = JSON.parse(file) as Database
            store.database = data
            return true
        } catch (err) {
            log('error parsing data')
        }
    } else {
        log('Creating database')
        fs.writeFileSync(filename, JSON.stringify(store.database), 'utf-8')
        return true
    }
    return false
}

const saveDatabase = () => {
    log('Saving...')
    try {
        fs.writeFileSync(filename, JSON.stringify(store.database), 'utf-8')
    } catch (err) {
        log('error writing to disk')
    }
}

export const getList = (name:OperationType) => store.database[name]

export const addTransaction = (collection:OperationType, transaction:Transaction) => {
    log('Adding transaction of ' + transaction.amount)
    store.database[collection].push(transaction)
    saveDatabase()
}

const getDebts = (collection:OperationType, type:'from'|'to', name:string) => {
    const filterPerson = store.database[collection].filter(transaction => transaction[type] === name)
    return filterPerson.reduce((acc, curr) => curr.amount + acc, 0)
}

/** Devuelve la suma de las deudas `hacia` un sujeto */
export const getDebtsToPerson = (name:string):number => {
    return getDebts(OperationType.Debt, 'to', name)
}

/** Devuelve la suma de las deudas `de` un sujeto */
export const getDebtsFromPerson = (name:string):number => {
    return getDebts(OperationType.Owe, 'from', name)
}

export const getTotalPayments = ():number => {
    return store.database[OperationType.Payment].reduce((acc, curr) => curr.amount + acc, 0)
}