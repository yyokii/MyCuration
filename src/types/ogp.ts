export class OGP {
  readonly url: string
  readonly title: string
  readonly description: string
  readonly siteName: string

  constructor(url: string, title: string, description: string, siteName: string) {
    this.url = url
    this.title = title
    this.description = description
    this.siteName = siteName
  }

  static empty(): OGP {
    return new OGP('', '', '', '')
  }
}
