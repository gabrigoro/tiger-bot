import fs from 'fs'
import store, { Collection, Database, Transaction } from './store'
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

export const getList = (name:Collection) => store.database[name]

export const addTransaction = (collection:Collection, transaction:Transaction) => {
    log('Adding transaction of ' + transaction.amount)
    store.database[collection].push(transaction)
    saveDatabase()
}

const getDebts = (collection:Collection, type:'from'|'to', name:string) => {
    const filterPerson = store.database[collection].filter(transaction => transaction[type] === name)
    return filterPerson.reduce((acc, curr) => curr.amount + acc, 0)
}

/** Devuelve la suma de las deudas `hacia` un sujeto */
export const getDebtsToPerson = (name:string):number => {
    return getDebts(Collection.my_debts, 'to', name)
}

/** Devuelve la suma de las deudas `de` un sujeto */
export const getDebtsFromPerson = (name:string):number => {
    return getDebts(Collection.others_debts, 'from', name)
}

export const getTotalPayments = ():number => {
    return store.database[Collection.payments].reduce((acc, curr) => curr.amount + acc, 0)
}