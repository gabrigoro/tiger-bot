import fb from './firebase'
import { Collections, ErrorCode, MONTH, OperationType, Transaction, User, WEEK, YEAR } from './enum'

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

const getExpensesFromUser = async (username:string):Promise<Transaction[]> => {
	return getTransactionsFromUser(OperationType.Payment, username)
}

const getIncomeFromUser = async (username:string):Promise<Transaction[]> => {
	return getTransactionsFromUser(OperationType.Income, username)
}

export const getExpenses = async (username:string) => {
    const now = (new Date()).getTime()
    const list = await getExpensesFromUser(username)
    const lastWeek = list.filter((doc) => doc.date > now - WEEK)
    const lastMonth = list.filter((doc) => doc.date > now - MONTH)
    const lastYear = list.filter((doc) => doc.date > now - YEAR)

    return {
        lastWeek: count(lastWeek),
        lastMonth: count(lastMonth),
        lastYear: count(lastYear),
        total: count(list)
    }
}

export const getIncome = async (username:string) => {
    const now = (new Date()).getTime()
    const list = await getIncomeFromUser(username)
    const lastWeek = list.filter((doc) => doc.date > now - WEEK)
    const lastMonth = list.filter((doc) => doc.date > now - MONTH)
    const lastYear = list.filter((doc) => doc.date > now - YEAR)

    return {
        lastWeek: count(lastWeek),
        lastMonth: count(lastMonth),
        lastYear: count(lastYear),
        total: count(list)
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

export const getAllUsers = ():Promise<User[]> => {
    return fb.getCollection(Collections.Users)
}

export const addNewUser = async (username:string) => {
    const usersCollection = await getAllUsers()
    const userExists = usersCollection.some((user) => user.id === username)

    if (userExists) throw ErrorCode.Exists

    return fb.upload(Collections.Users, {
        dateCreated: (new Date()).getTime()
    }, username)
}