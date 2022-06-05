import { Box } from '@chakra-ui/react'
import { CUIAutoComplete, Item } from 'chakra-ui-autocomplete'

type Props = {
  label: string
  placeholder: string
  items: Item[]
  selectedItems: Item[]
  handleSelectedItemsChange: (value: any[]) => void
}

export default function AutoComplete<T>(props: Props) {
  return (
    <Box px={8} py={4}>
      <CUIAutoComplete
        label={props.label}
        placeholder={props.placeholder}
        disableCreateItem={true}
        items={props.items}
        tagStyleProps={{
          rounded: 'full',
          pt: 1,
          pb: 2,
          px: 2,
          fontSize: '1rem',
        }}
        selectedItems={props.selectedItems}
        onSelectedItemsChange={(changes) => props.handleSelectedItemsChange(changes.selectedItems)}
      />
    </Box>
  )
}
