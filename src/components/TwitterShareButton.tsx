type Props = {
  url: string
  text: string
}

export default function TwitterShareButton(props: Props) {
  const url = `https://twitter.com/share?url=${encodeURIComponent(
    props.url,
  )}&text=${encodeURIComponent(props.text)}&hashtags=MyService`

  return (
    <a href={url} className='twitter-share-button' target='_blank' rel='noreferrer'>
      <img src='/images/Logo_Twitter_White.svg' width='24' height='24' />
      <span>シェア</span>
    </a>
  )
}
