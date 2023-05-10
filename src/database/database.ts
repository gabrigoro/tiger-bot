import fb from './firebase'
import { Collections, ErrorCode, MONTH, OperationType, Transaction, User, WEEK, YEAR } from '../enum'
import { getDate } from '../utils/handlers'
import { getBotStatus } from '../botControl'

const count = (list: Transaction[]) => list.reduce((acc, curr) => acc + curr.amount, 0)

const getTransactionsFromUser = async (operation: OperationType, username: string) => {
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

const getExpensesFromUser = async (username: string): Promise<Transaction[]> => {
	return getTransactionsFromUser(OperationType.Payment, username)
}

const getIncomeFromUser = async (username: string): Promise<Transaction[]> => {
	return getTransactionsFromUser(OperationType.Income, username)
}

export const getExpenses = async (username: string) => {
	const now = new Date().getTime()
	const list = await getExpensesFromUser(username)
	const lastWeek = list.filter((doc) => doc.date > now - WEEK)
	const lastMonth = list.filter((doc) => doc.date > now - MONTH)
	const lastYear = list.filter((doc) => doc.date > now - YEAR)

	return {
		lastWeek: count(lastWeek),
		lastMonth: count(lastMonth),
		lastYear: count(lastYear),
		total: count(list),
	}
}

export const getIncome = async (username: string) => {
	const now = new Date().getTime()
	const list = await getIncomeFromUser(username)
	const lastWeek = list.filter((doc) => doc.date > now - WEEK)
	const lastMonth = list.filter((doc) => doc.date > now - MONTH)
	const lastYear = list.filter((doc) => doc.date > now - YEAR)

	return {
		lastWeek: count(lastWeek),
		lastMonth: count(lastMonth),
		lastYear: count(lastYear),
		total: count(list),
	}
}

export const addTransaction = (transaction: Transaction) => {
	return fb.upload(transaction.type, transaction)
}

/** Devuelve las deudas `hacia` un sujeto */
export const getDebtsOfUser = (username: string) => {
	return getTransactionsFromUser(OperationType.Debt, username)
}

/** Devuelve las deudas `de` un sujeto */
export const getOwesFromPerson = (username: string) => {
	return getTransactionsFromUser(OperationType.Owe, username)
}

export const getAllUsers = async (): Promise<User[]> => {
	const usersList = await fb.getCollection<User>(Collections.Users)

	// convierte la id de string a number
	return usersList.map((user) => ({ ...user, id: parseInt(user.id) }))
}

export const addNewUser = async (user: User) => {
	const usersCollection = await getAllUsers()
	const userExists = usersCollection.some((u) => u.id === user.id)

	if (userExists) throw ErrorCode.Exists

	return fb.upload(Collections.Users, user, user.id.toString())
}

/**
 * SECCION FEEDBACK
 */

/**
 * Sube feedback del usuario junto con la fecha
 * @param username '123123123'
 * @param text feedback text
 */
export async function addNewAnonFeedback(userId: number, text: string) {
	return fb.upload('feedback', {
		userId,
		text,
		date: getDate(),
	})
}

/**
 * SUSCRIPCIONES
 */

/**
 * Intercala la suscripcion al valor del dolar del {@link User}
 * @returns Nuevo estado de suscripcion
 */
export async function toggleDolarSubscriptionOfUser(userId: number): Promise<boolean> {
	const subscribed = await isUserSubscribedToDolar(userId)
	await fb.update(Collections.Users, userId.toString(), 'dolar', !subscribed)
	console.log('toggleDolarSubscriptionOfUser', !subscribed)
	return !subscribed
}

/**
 * Realiza un llamado a la base de datos para devolver el estado de la suscripcion al valor del dolar
 */
export async function isUserSubscribedToDolar(userId: number): Promise<boolean> {
	const users = (await fb.getCollection(Collections.Users)) as User[]
	const user = users.find((u) => u.id /** u.id es string */ == userId)
	console.log('user: ', users, userId, user)
	console.log('isUserSubscribedToDolar', user!.dolar)
	return user!.dolar
}
