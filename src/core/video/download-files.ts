import Axios from 'axios'
import * as fs from 'fs'

type downloadVideoAndAudioParams = {
  audioUrl: string
  videoUrl: string
  subtitlesUrl: string
  audioOutputPath: string
  videoOutputPath: string
  subtitlesOutputPath: string
}

export default async function downloadFiles({
  audioUrl,
  videoUrl,
  subtitlesUrl,
  audioOutputPath,
  videoOutputPath,
  subtitlesOutputPath,
}: downloadVideoAndAudioParams): Promise<void> {
  const audioResponse = await Axios({
    method: 'GET',
    url: audioUrl,
    responseType: 'arraybuffer',
  })

  const videoResponse = await Axios({
    method: 'GET',
    url: videoUrl,
    responseType: 'arraybuffer',
  })

  const subtitlesResponse = await Axios({
    method: 'GET',
    url: subtitlesUrl,
    responseType: 'text',
  })

  fs.writeFileSync(audioOutputPath, audioResponse.data)

  fs.writeFileSync(videoOutputPath, videoResponse.data)

  fs.writeFileSync(subtitlesOutputPath, subtitlesResponse.data)
}
