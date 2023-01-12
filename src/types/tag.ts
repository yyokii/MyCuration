export class Tag {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  isSelected: boolean

  constructor(id: string, name: string, createdAt: string, updatedAt: string, isSelected: boolean) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.isSelected = isSelected
  }

  static makeNewTagWithName(name: string, isSelected: boolean): Tag {
    return new Tag('', name, null, null, isSelected)
  }
}
