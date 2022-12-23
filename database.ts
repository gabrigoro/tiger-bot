import fb from './firebase'
import { MONTH, OperationType, Transaction, WEEK, YEAR } from './enum'

const count = (list:Transaction[]) => list.reduce((acc, curr) => acc + curr.amount, 0)

const getTransactionsFromUser = async (operation:OperationType, username:string) => {
	const transactions = await fb.getFilteredCollection(operation, 'from', username)
    
    return transactions.map<Transaction>((data) => {
		return {
			amount: data.amount,
			category: data.category,
			date: data.date,
			from: data.from,
			resolved: data.resolved,
			to: data.to,
			type: data.type,
		}
    })
}

export const getExpensesFromUser = async (username:string):Promise<Transaction[]> => {
	return getTransactionsFromUser(OperationType.Payment, username)
}

export const getExpenses = async (username:string) => {
    const now = (new Date()).getTime()
    const list = await getExpensesFromUser(username)
    const lastWeek = list.filter((debt) => debt.date > now - WEEK)
    const lastMonth = list.filter((debt) => debt.date > now - MONTH)
    const lastYear = list.filter((debt) => debt.date > now - YEAR)

    return {
        lastWeek: count(lastWeek),
        lastMonth: count(lastMonth),
        lastYear: count(lastYear)
    }
}

export const addTransaction = (transaction:Transaction) => {
    return fb.upload(transaction.type, transaction)
}

/** Devuelve las deudas `hacia` un sujeto */
export const getDebtsOfUser = (username:string) => {
    return getTransactionsFromUser(OperationType.Debt, username)
}

/** Devuelve las deudas `de` un sujeto */
export const getOwesFromPerson = (username:string) => {
    return getTransactionsFromUser(OperationType.Owe, username)
}