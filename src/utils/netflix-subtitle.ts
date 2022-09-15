import cheerio from 'cheerio'
import * as luxon from 'luxon'
import convertXml from 'xml-js'

type NetflixSubtitleType = {
  index: number
  start: string
  end: string
  text: string
}

function convertTimestamp(tickRate: any, t: any) {
  let r = parseInt(t.replace(/[^0-9]/g, ''))
  r = Math.round(r / (tickRate / 1000))
  return luxon.Duration.fromMillis(r).toFormat('hh:mm:ss,SSS')
}

export async function netflixSubtitle(
  netflixSubtitles: string
): Promise<NetflixSubtitleType[]> {
  const $ = cheerio.load(netflixSubtitles, { xmlMode: true })
  const subtitlesJson = convertXml.xml2json(netflixSubtitles, {
    compact: true,
    spaces: 4,
  })
  const subtitles = JSON.parse(subtitlesJson).tt.body.div.p

  const tickRate = $('tt').attr('ttp:tickRate')

  const result: NetflixSubtitleType[] = []
  const index = 1
  for (const p of $('p').get()) {
    const subtitle = subtitles[index - 1]
    const begin = convertTimestamp(tickRate, $(p).attr('begin'))
    const end = convertTimestamp(tickRate, $(p).attr('end'))

    const text = Array.isArray(subtitle._text)
      ? subtitle._text.join(' ')
      : subtitle._text
    result.push({
      index,
      start: begin,
      end,
      text,
    })
  }

  return result
}
