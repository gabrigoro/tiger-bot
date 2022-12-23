import { initializeApp } from 'firebase/app'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import { OperationType, Transaction } from './enum'
import dotenv from 'dotenv'
dotenv.config()

const app = initializeApp({
	apiKey: process.env.API_KEY,
	authDomain: "purpose-tiger.firebaseapp.com",
	projectId: "purpose-tiger",
	storageBucket: "purpose-tiger.appspot.com",
	messagingSenderId: "760962459657",
	appId: "1:760962459657:web:218fc9cfa4121bd935f0d8"
  })

export const database = getFirestore(app)

export const uploadTransaction = (transaction:Transaction) => {
	return addDoc(collection(database, transaction.type), transaction)
}

export const getExpenses = async ():Promise<Transaction[]> => {
	const investmentCol = collection(database, OperationType.Payment)
	const q = query(investmentCol, where("from", "==", '1174794170'))
    const investmentsSnapshot = await getDocs(q)
    
    const investmentsList = investmentsSnapshot.docs.map<Transaction>((doc) => {
        const data = doc.data()
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

    return investmentsList
}