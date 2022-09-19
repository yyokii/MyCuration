import { Box, HStack } from '@chakra-ui/react'

export type CategoriesRatio = {
  name: string
  ratio: number
}

type Props = {
  categoriesRatio: CategoriesRatio[]
}

export default function CategoriesRatioList<T>(props: Props) {
  return (
    <HStack spacing='24px'>
      {props.categoriesRatio.map((data) => (
        <Box key={data.name}>
          <Box>{data.name}</Box>
          <Box>{data.ratio}%</Box>
        </Box>
      ))}
    </HStack>
  )
}
