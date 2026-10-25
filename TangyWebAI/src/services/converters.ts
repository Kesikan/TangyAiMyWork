import {
  Timestamp,
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { Category, Product } from '@/types'

function toDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null
}

function withoutIdAndUndefined(model: object): DocumentData {
  return Object.fromEntries(
    Object.entries(model).filter(([key, value]) => key !== 'id' && value !== undefined),
  )
}

export const categoryConverter: FirestoreDataConverter<Category> = {
  toFirestore(model: PartialWithFieldValue<Category>): DocumentData {
    return withoutIdAndUndefined(model)
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Category {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      nameKey: data.nameKey,
      description: data.description,
      sortOrder: data.sortOrder,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    }
  },
}

export const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(model: PartialWithFieldValue<Product>): DocumentData {
    return withoutIdAndUndefined(model)
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Product {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable ?? true,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    }
  },
}
