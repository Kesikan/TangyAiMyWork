export interface CategoryFormValues {
  name: string
  description: string
  sortOrder: string
}

export interface ProductFormValues {
  name: string
  description: string
  price: string
  categoryId: string
  imageUrl: string
  isAvailable: boolean
}

export type Errors<T> = Partial<Record<keyof T, string>>

export function validateCategory(values: CategoryFormValues): Errors<CategoryFormValues> {
  const errors: Errors<CategoryFormValues> = {}
  const name = values.name.trim()
  if (!name) errors.name = 'Name is required.'
  else if (name.length > 60) errors.name = 'Name must be 60 characters or fewer.'
  if (values.description.trim().length > 300) {
    errors.description = 'Description must be 300 characters or fewer.'
  }
  if (!/^\d+$/.test(values.sortOrder.trim())) {
    errors.sortOrder = 'Sort order must be a whole number, 0 or greater.'
  }
  return errors
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateProduct(values: ProductFormValues): Errors<ProductFormValues> {
  const errors: Errors<ProductFormValues> = {}
  const name = values.name.trim()
  const description = values.description.trim()
  const price = values.price.trim()
  const imageUrl = values.imageUrl.trim()

  if (!name) errors.name = 'Name is required.'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.'

  if (!description) errors.description = 'Description is required.'
  else if (description.length > 1000) {
    errors.description = 'Description must be 1000 characters or fewer.'
  }

  if (!price) errors.price = 'Price is required.'
  else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    errors.price = 'Enter a price of 0 or more with up to 2 decimals.'
  } else if (Number(price) > 100000) errors.price = 'Price must be 100000 or less.'

  if (!values.categoryId) errors.categoryId = 'Choose a category.'

  if (imageUrl) {
    if (imageUrl.length > 2048) errors.imageUrl = 'Image URL is too long.'
    else if (!isValidUrl(imageUrl)) errors.imageUrl = 'Enter a valid http(s) URL.'
  }
  return errors
}
