import { initializeApp } from 'firebase/app'
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import dotenv from 'dotenv'
dotenv.config()

const app = initializeApp({
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID
})

const database = getFirestore(app)

const upload = (collectionName:string, document:object) => {
	return addDoc(collection(database, collectionName), document)
}

const getCollection = async (collectionName:string) => {
	const col = collection(database, collectionName)
	const snapshot = await getDocs(col)
	return snapshot.docs.map((doc) => {
		const data = doc.data() as any
		return { id: doc.id, ...data }
	})
}

const getFilteredCollection = async (collectionName:string, field:string, value:string) => {
	const col = collection(database, collectionName)
	const q = query(col, where(field, '==', value))
	const snapshot = await getDocs(q)
	return snapshot.docs.map((doc) => {
		const data = doc.data() as any
		return { id: doc.id, ...data }
	})
}

export default {
	getCollection,
	getFilteredCollection,
	upload
}