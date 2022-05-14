import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { JSDOM } from 'jsdom'

/**
 * 
 * 次のようなリクエストがあった際にレスポンスとしてメタ情報を返却する
 * https://aaa.bbb.ccc/api/loadOGPData?url=https://zenn.dev
 * 
 * todo:
 * ogpは更新頻度は1月以上に1回ぐらいなので、キャッシュしたい
 * vercelにデプロイするのでヘッダー変えておけばよしなにやってくれそう
 * https://vercel.com/docs/concepts/functions/serverless-functions
 */
export default async function loadOGPdata(req: NextApiRequest, res: NextApiResponse) {
    const targetUrl = req.query.url as string

    if (!targetUrl) {
        sendErrorResponse(res, "url is required")
    }

    const ogp: any = {}

    const encodedUri = encodeURI(targetUrl)
    const headers = { 'User-Agent': 'bot' }

    try {
        const res = await axios.get(encodedUri, { headers: headers })
        const html = res.data
        const dom = new JSDOM(html)
        const meta = dom.window.document.head.querySelectorAll("meta")
        const ogpData = extractOgp(Array.from(meta))
        ogp[targetUrl] = ogpData
    } catch (error) {
        console.error(error)
        sendErrorResponse(res, error)
    }
    res.status(200).json(ogp)
}

/**
 * HTMLのmetaタグからogpを抽出
 */
function extractOgp(metaElements: HTMLMetaElement[]): object {
    const ogp = metaElements
        .filter((element: Element) => element.hasAttribute("property")) // poperty属性があるものがOGP情報である
        .reduce((previous: any, current: Element) => {
            const property = current.getAttribute("property")?.trim()
            if (!property) return;
            const content = current.getAttribute("content")
            previous[property] = content
            return previous
        }, {})

    return ogp
}

function sendErrorResponse(response: NextApiResponse, message: string): void {
    response.status(400).send(message)
}