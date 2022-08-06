import { Button } from '@chakra-ui/react'

type Props = {
  title: string
  isSending: boolean
  onClick: () => void
}

export default function NormalButton(props: Props) {
  return (
    <Button
      isLoading={props.isSending}
      loadingText='Submitting'
      colorScheme='teal'
      variant='outline'
      onClick={props.onClick}
    >
      {props.title}
    </Button>
  )
}
