import { FFScene, FFVideo, FFCreator } from 'ffcreator'
import { getVideoDurationInSeconds } from 'get-video-duration'
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

FFCreator.setFFmpegPath(ffmpegInstaller.path)

export default async function editVideo({
  videoFilePath,
  audioFilePath,
  outputFilePath,
}: {
  videoFilePath: string
  audioFilePath: string
  outputFilePath: string
}): Promise<FFCreatorSpace.FFCreatorCompleteEvent> {
  const loadPromise = new Promise<FFCreatorSpace.FFCreatorCompleteEvent>(
    async (resolve, reject) => {
      const rawVideoDuration = await getVideoDurationInSeconds(videoFilePath)

      const creator = new FFCreator({
        cacheDir: './.cache',
        width: 720,
        height: 1280,
      })

      const scene = new FFScene()
      scene.setDuration(rawVideoDuration + 0.5)
      scene.setBgColor('#000000')
      scene.addAudio({
        path: audioFilePath,
      })
      creator.addChild(scene)

      const video = new FFVideo({
        path: videoFilePath,
        x: 360,
        y: 640,
        width: 720,
        height: 1280,
      })
      video.setAudio(false)
      scene.addChild(video)

      creator.output(outputFilePath)
      creator.start()

      creator.on('error', (e) => {
        reject(e)
      })

      creator.on('complete', (e) => {
        resolve(e)
      })
    }
  )
  return loadPromise
}
