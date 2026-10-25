import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Category, CategoryInput } from '@/types'
import { categoryConverter } from './converters'
import { CategoryInUseError, DuplicateCategoryNameError } from './errors'
import { countProductsByCategory } from './productService'

const COLLECTION = 'categories'

function categoriesRef() {
  return collection(db, COLLECTION).withConverter(categoryConverter)
}

export function toNameKey(name: string): string {
  return name.trim().toLowerCase()
}

async function assertNameAvailable(name: string, ignoreId?: string): Promise<void> {
  const snapshot = await getDocs(query(categoriesRef(), where('nameKey', '==', toNameKey(name))))
  if (snapshot.docs.some((d) => d.id !== ignoreId)) {
    throw new DuplicateCategoryNameError(name.trim())
  }
}

export async function listCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(categoriesRef(), orderBy('sortOrder'), orderBy('name')))
  return snapshot.docs.map((d) => d.data())
}

export async function createCategory(input: CategoryInput): Promise<string> {
  const name = input.name.trim()
  const description = input.description?.trim()
  await assertNameAvailable(name)

  const ref = doc(collection(db, COLLECTION)).withConverter(categoryConverter)
  await setDoc(ref, {
    id: ref.id,
    name,
    nameKey: toNameKey(name),
    ...(description ? { description } : {}),
    sortOrder: input.sortOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  const name = input.name.trim()
  const description = input.description?.trim()
  await assertNameAvailable(name, id)

  await updateDoc(doc(db, COLLECTION, id), {
    name,
    nameKey: toNameKey(name),
    description: description || deleteField(),
    sortOrder: input.sortOrder,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  const productCount = await countProductsByCategory(id)
  if (productCount > 0) {
    throw new CategoryInUseError(productCount)
  }
  await deleteDoc(doc(db, COLLECTION, id))
}
