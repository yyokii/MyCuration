import { Select } from '@chakra-ui/react'
import { Category } from '../../types/category'

type Props = {
  categories: Category[]
  onChange: (value: string) => void
}

function CategorySelect(props: Props) {
  return (
    <Select placeholder='Select Category' onChange={(e) => props.onChange(e.target.value)}>
      {props.categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  )
}

export { CategorySelect }
