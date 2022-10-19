interface Database {
    payments: any[]
    my_debts: any[]
    others_debts: any[]
}

interface Store {
    running: boolean
    database?: Database
}

const store:Store = {
    running: false
}

export default store