import fb from './firebase'
import { OperationType, Transaction } from './enum'

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