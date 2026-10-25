// Run with: npm run seed (reads .env via node --env-file)
import { initializeApp } from 'firebase/app'
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
})
const db = getFirestore(app)
if (process.env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

const categories = [
  { name: 'Appetizer', description: 'Small plates to start.' },
  { name: 'Entree', description: 'Hearty main dishes.' },
  { name: 'Dessert', description: 'Something sweet to finish.' },
]

const IMAGE_BASE = 'https://testkesis.blob.core.windows.net/tangyaidemo'

const products: Array<{
  category: string
  name: string
  description: string
  price: number
  image: string
}> = [
  { category: 'Appetizer', name: 'Caprese', description: 'Fresh mozzarella, ripe tomato and basil with olive oil.', price: 9, image: 'Caprese.png' },
  { category: 'Appetizer', name: 'Bruschetta', description: 'Grilled bread topped with tomato, basil and garlic.', price: 8, image: 'Bruschetta.png' },
  { category: 'Appetizer', name: 'Focaccia', description: 'Warm rosemary focaccia baked with sea salt and olive oil.', price: 7, image: 'Focaccia.png' },
  { category: 'Entree', name: 'Cacio e Pepe', description: 'Spaghetti with pecorino romano and freshly cracked black pepper.', price: 17, image: 'Cacio_e_Pepe.png' },
  { category: 'Entree', name: 'Margherita Pizza', description: 'Wood-fired pizza with tomato, mozzarella and fresh basil.', price: 16, image: 'Margherita_Pizza.png' },
  { category: 'Entree', name: 'Pasta al Pomodoro', description: 'Pasta in a simple sauce of ripe tomatoes, garlic and basil.', price: 15, image: 'Pasta_al_Pomodoro.png' },
  { category: 'Entree', name: 'Pesto Genovese', description: 'Pasta tossed in basil pesto with pine nuts and parmesan.', price: 17, image: 'Pesto_Genovese.png' },
  { category: 'Entree', name: 'Pesto Pizza', description: 'Pizza with basil pesto, mozzarella and cherry tomatoes.', price: 17, image: 'Pesto_Pizza.png' },
  { category: 'Entree', name: 'Ravioli di Spinaci', description: 'Spinach and ricotta ravioli in a sage butter sauce.', price: 19, image: 'Ravioli_di_Spinaci.png' },
  { category: 'Dessert', name: 'Cannoli', description: 'Crisp pastry shells filled with sweet ricotta cream.', price: 8, image: 'Cannoli.png' },
  { category: 'Dessert', name: 'Panna Cotta', description: 'Silky vanilla cream pudding with berry sauce.', price: 8, image: 'Panna_Cotta.png' },
  { category: 'Dessert', name: 'Tiramisu', description: 'Espresso-soaked ladyfingers layered with mascarpone and cocoa.', price: 9, image: 'Tiramisu.png' },
]

const existing = await getDocs(query(collection(db, 'categories'), limit(1)))
if (!existing.empty) {
  console.log('Categories already exist. Skipping seed.')
  process.exit(0)
}

const batch = writeBatch(db)
const categoryIds = new Map<string, string>()

categories.forEach((category, index) => {
  const ref = doc(collection(db, 'categories'))
  categoryIds.set(category.name, ref.id)
  batch.set(ref, {
    name: category.name,
    nameKey: category.name.toLowerCase(),
    description: category.description,
    sortOrder: index + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
})

for (const product of products) {
  const categoryId = categoryIds.get(product.category)
  if (!categoryId) throw new Error(`Unknown category ${product.category}`)
  batch.set(doc(collection(db, 'products')), {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId,
    imageUrl: `${IMAGE_BASE}/${product.image}`,
    isAvailable: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

await batch.commit()
console.log(`Seeded ${categories.length} categories and ${products.length} products.`)
process.exit(0)
