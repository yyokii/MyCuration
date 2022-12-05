export class OGP {
  readonly url: string
  readonly title: string
  readonly description: string
  readonly image: string

  constructor(url: string, title: string, description: string, image: string) {
    this.url = url
    this.title = title
    this.description = description
    this.image = image
  }
}
