import { OperationType } from "./enum"

export interface Transaction {
    amount: number
    from: string
    to: string
    debt: boolean
    date: Date
}

export interface Database {
    [OperationType.Payment]: Transaction[]
    [OperationType.Debt]: Transaction[]
    [OperationType.Owe]: Transaction[]
}

export interface Store {
    testing: boolean
    running: boolean
    database: Database
}

const store:Store = {
    running: false,
    testing: Boolean(process.env.TESTING),
    database: {
        [OperationType.Payment]: [],
        [OperationType.Debt]: [],
        [OperationType.Owe]: []
    }
}

export default store