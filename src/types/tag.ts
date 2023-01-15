class Tag {
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

  static makeAllTag(): Tag {
    return new Tag('all', 'All', null, null, false)
  }

  isAllTag(): boolean {
    return this.id === 'all' || this.name === allTagName
  }
}

const allTagName = 'All'

export { Tag, allTagName }
