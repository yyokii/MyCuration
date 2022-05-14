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
    const targetUrls = extractUrlParams(req, res);

    if (!targetUrls) return;

    const ogps: any = {};

    // URLごとにOGPを取得
    await Promise.all(
        targetUrls.map(async (targetUrl: string) => {
            const encodedUri = encodeURI(targetUrl);
            const headers = { 'User-Agent': 'bot' };

            try {
                const res = await axios.get(encodedUri, { headers: headers });
                const html = res.data;
                const dom = new JSDOM(html);
                const meta = dom.window.document.head.querySelectorAll("meta");
                const ogp = extractOgp(Array.from(meta));
                ogps[targetUrl] = ogp;
            } catch (error) {
                console.error(error)
                sendErrorResponse(res, error)
            }
        }));

    res.status(200).json(ogps);
}

function extractUrlParams(req: NextApiRequest, res: NextApiResponse): string[] {
    const url = req.query.url;
    const urls = req.query.urls;

    if (url && urls) {
        sendErrorResponse(res, "Request query can't have both 'url' and 'urls'");
        return [];
    } else if (url) {
        if (Array.isArray(url)) {
            sendErrorResponse(res, "'url' must be string");
            return [];
        }
        return [<string>url];
    } else if (urls) {
        if (!Array.isArray(urls)) {
            sendErrorResponse(res, "'urls' must be array of string");
            return [];
        }
        return <string[]>urls;
    } else {
        sendErrorResponse(res, "Either 'url' or 'urls' must be included");
        return [];
    }
}

/**
 * HTMLのmetaタグからogpを抽出
 */
function extractOgp(metaElements: HTMLMetaElement[]): object {
    const ogp = metaElements
        .filter((element: Element) => element.hasAttribute("property")) // poperty属性があるものがOGP情報である
        .reduce((previous: any, current: Element) => {
            const property = current.getAttribute("property")?.trim();
            if (!property) return;
            const content = current.getAttribute("content");
            previous[property] = content;
            return previous;
        }, {});

    return ogp;
}


function sendErrorResponse(response: NextApiResponse, message: string): void {
    response.status(400).send(message);
}