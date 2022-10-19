import fs from 'fs'
import store, { Collection, Database, Transaction } from './store'
const log = (str:string) => console.log('[database]', str)

export const start = () => {
    log('Starting database')
    if (fs.existsSync('./database.json')) {
        log('Reading existing database')
        const file = fs.readFileSync('./database.json', 'utf-8')
        try {
            const data = JSON.parse(file) as Database
            store.database = data
            log('stored')
            return true
        } catch (err) {
            log('error parsing data')
        }
    } else {
        log('Creating database')
        fs.writeFileSync('./database.json', JSON.stringify(store.database), 'utf-8')
        return true
    }
    return false
}

const saveDatabase = () => {
    log('saving database')
    try {
        fs.writeFileSync('./database.json', JSON.stringify(store.database), 'utf-8')
    } catch (err) {
        log('error writing to disk')
    }
}

export const getList = (name:Collection) => store.database[name]

export const addTransaction = (collection:Collection, transaction:Transaction) => {
    store.database[collection].push(transaction)
    saveDatabase()
}