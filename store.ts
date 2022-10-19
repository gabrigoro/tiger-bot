export enum Collection {
    payments = 'payments',
    my_debts = 'my_debts',
    others_debts = 'others_debts'
}

export interface Transaction {
    amount: number
    from: string
    to: string
    debt: boolean
    date: Date
}

export interface Database {
    [Collection.payments]: Transaction[]
    [Collection.my_debts]: Transaction[]
    [Collection.others_debts]: Transaction[]
}

export interface Store {
    running: boolean
    database: Database
}

const store:Store = {
    running: false,
    database: {
        [Collection.payments]: [],
        [Collection.my_debts]: [],
        [Collection.others_debts]: []
    }
}

export default store