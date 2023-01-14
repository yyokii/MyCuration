import { Button, ButtonProps } from '@chakra-ui/react'

export default function NormalButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      loadingText='Loading'
      colorScheme='teal'
      variant='outline'
      onClick={props.onClick}
    />
  )
}
