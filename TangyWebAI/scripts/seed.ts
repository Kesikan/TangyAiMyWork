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
  { name: 'Appetizers', description: 'Small plates to start.' },
  { name: 'Mains', description: 'Hearty main dishes.' },
  { name: 'Desserts', description: 'Something sweet to finish.' },
  { name: 'Drinks', description: 'Hot, cold and refreshing.' },
]

const products: Array<{
  category: string
  name: string
  description: string
  price: number
  isAvailable?: boolean
}> = [
  { category: 'Appetizers', name: 'Crispy Calamari', description: 'Lightly battered squid with lemon aioli.', price: 9.5 },
  { category: 'Appetizers', name: 'Bruschetta', description: 'Grilled bread, tomato, basil and garlic.', price: 7.5 },
  { category: 'Appetizers', name: 'Spicy Chicken Wings', description: 'Tossed in tangy chili glaze with ranch dip.', price: 10 },
  { category: 'Mains', name: 'Grilled Salmon', description: 'Atlantic salmon with citrus butter and seasonal greens.', price: 22 },
  { category: 'Mains', name: 'Tangy BBQ Ribs', description: 'Slow-cooked pork ribs with house barbecue sauce and fries.', price: 24.5 },
  { category: 'Mains', name: 'Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and parmesan.', price: 18 },
  { category: 'Mains', name: 'Chicken Parmigiana', description: 'Crumbed chicken breast, napoli sauce and melted mozzarella.', price: 20, isAvailable: false },
  { category: 'Desserts', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten centre and vanilla ice cream.', price: 8.5 },
  { category: 'Desserts', name: 'Lemon Tart', description: 'Sharp lemon curd in a buttery pastry shell.', price: 7.5 },
  { category: 'Drinks', name: 'Fresh Lemonade', description: 'Squeezed to order with mint.', price: 4.5 },
  { category: 'Drinks', name: 'Iced Coffee', description: 'Cold brew over ice with a splash of milk.', price: 5 },
  { category: 'Drinks', name: 'Mango Smoothie', description: 'Blended mango, yoghurt and honey.', price: 6.5 },
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
    isAvailable: product.isAvailable ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

await batch.commit()
console.log(`Seeded ${categories.length} categories and ${products.length} products.`)
process.exit(0)
