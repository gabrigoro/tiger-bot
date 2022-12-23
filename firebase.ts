import { initializeApp } from 'firebase/app'
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
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