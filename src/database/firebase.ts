import { initializeApp } from 'firebase/app'
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore'
import dotenv from 'dotenv'
import { Collections } from '../enum'
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

const upload = (collectionName:string, document:object, id?:string) => {
	/** Testing Database */
	// if (process.env.VITEST) return testUpload(collectionName, document, id='')

	/** setDoc setea la id manualmente */
	if (id) return setDoc(doc(database, collectionName, id), document)

	/** addDoc setea la id automaticamente */
	return addDoc(collection(database, collectionName), document)
}

const getCollection = async <T>(collectionName:string) => {
	const col = collection(database, collectionName)
	const snapshot = await getDocs(col)
	return snapshot.docs.map((doc) => {
		const data = doc.data() as T
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

const update = async (collection:Collections, document:string, field:string, value:any) => {
	const ref = doc(database, collection, document)
	return updateDoc(ref, {
		[field]: value
	})
}

export default {
	getCollection,
	getFilteredCollection,
	update,
	upload
}