import { describe, expect, it } from 'vitest'
import { validateCategory, validateProduct } from '../validation'

const validProduct = {
  name: 'Soup',
  description: 'Tomato soup',
  price: '6.50',
  categoryId: 'c1',
  imageUrl: '',
  isAvailable: true,
}

describe('validateProduct', () => {
  it('accepts a valid product', () => {
    expect(validateProduct(validProduct)).toEqual({})
  })

  it('requires name, description and category', () => {
    const errors = validateProduct({ ...validProduct, name: ' ', description: '', categoryId: '' })
    expect(Object.keys(errors).sort()).toEqual(['categoryId', 'description', 'name'])
  })

  it.each(['-1', 'abc', '1.234', ''])('rejects price %j', (price) => {
    expect(validateProduct({ ...validProduct, price }).price).toBeDefined()
  })

  it('accepts price 0 and whole numbers', () => {
    expect(validateProduct({ ...validProduct, price: '0' }).price).toBeUndefined()
    expect(validateProduct({ ...validProduct, price: '12' }).price).toBeUndefined()
  })

  it('validates the image URL only when provided', () => {
    expect(validateProduct({ ...validProduct, imageUrl: 'not a url' }).imageUrl).toBeDefined()
    expect(
      validateProduct({ ...validProduct, imageUrl: 'javascript:alert(1)' }).imageUrl,
    ).toBeDefined()
    expect(
      validateProduct({ ...validProduct, imageUrl: 'https://example.com/a.jpg' }).imageUrl,
    ).toBeUndefined()
  })
})

describe('validateCategory', () => {
  it('requires a name and numeric sort order', () => {
    const errors = validateCategory({ name: '  ', description: '', sortOrder: 'x' })
    expect(Object.keys(errors).sort()).toEqual(['name', 'sortOrder'])
  })

  it('accepts valid input', () => {
    expect(validateCategory({ name: 'Drinks', description: '', sortOrder: '2' })).toEqual({})
  })
})
