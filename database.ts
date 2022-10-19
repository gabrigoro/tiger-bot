import fs from 'fs'
import store from './store'

export const start = () => {
    if (fs.existsSync('./database.json')) {
        const file = fs.readFileSync('./database.json', 'utf-8')
        try {
            store.database = JSON.parse(file)
            return true
        } catch (err) {
            console.log('error parsing data')
        }
    } else {
        fs.writeFileSync('./database.json', '{}', 'utf-8')
        store.database = {
            payments: [],
            my_debts: [],
            others_debts: []
        }
        return true
    }
    return false
}