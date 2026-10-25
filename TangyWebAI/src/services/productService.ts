import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Product, ProductInput } from '@/types'
import { productConverter } from './converters'

const COLLECTION = 'products'

function productsRef() {
  return collection(db, COLLECTION).withConverter(productConverter)
}

function clean(input: ProductInput): ProductInput {
  const imageUrl = input.imageUrl?.trim()
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    categoryId: input.categoryId,
    isAvailable: input.isAvailable,
    ...(imageUrl ? { imageUrl } : {}),
  }
}

export async function listProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsRef(), orderBy('name')))
  return snapshot.docs.map((d) => d.data())
}

export async function createProduct(input: ProductInput): Promise<string> {
  const ref = doc(collection(db, COLLECTION)).withConverter(productConverter)
  await setDoc(ref, {
    ...clean(input),
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const data = clean(input)
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    imageUrl: data.imageUrl ?? deleteField(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

export async function countProductsByCategory(categoryId: string): Promise<number> {
  const snapshot = await getCountFromServer(
    query(collection(db, COLLECTION), where('categoryId', '==', categoryId)),
  )
  return snapshot.data().count
}
