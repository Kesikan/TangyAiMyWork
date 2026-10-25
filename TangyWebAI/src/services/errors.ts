export class DuplicateCategoryNameError extends Error {
  constructor(name: string) {
    super(`A category named "${name}" already exists.`)
    this.name = 'DuplicateCategoryNameError'
  }
}

export class CategoryInUseError extends Error {
  readonly productCount: number

  constructor(productCount: number) {
    super(`Reassign or delete its ${productCount} products first.`)
    this.name = 'CategoryInUseError'
    this.productCount = productCount
  }
}
