import { OperationType, Transaction } from "./enum"

export interface Database {
    [OperationType.Payment]: Transaction[]
    [OperationType.Debt]: Transaction[]
    [OperationType.Owe]: Transaction[]
    [OperationType.Plan]: Transaction[]
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
        [OperationType.Owe]: [],
        [OperationType.Plan]: []
    }
}

export default store