import { describe, expect, it } from 'vitest'
import { formatPrice } from '../format'

describe('formatPrice', () => {
  it('formats prices as US dollars', () => {
    expect(formatPrice(12)).toBe('$12.00')
    expect(formatPrice(9.5)).toBe('$9.50')
  })
})
