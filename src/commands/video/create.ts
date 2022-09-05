import { GluegunCommand } from 'gluegun'
import listProfiles from '../../core/profile/list-profiles'
import * as path from 'path'
import listVideos from '../../core/video/list-videos'
import { getVideoFromNetflix } from '../../core/video/get-video-from-netflix'
import * as loading from 'loading-cli'
import downloadFiles from '../../core/video/download-files'
import editVideo from '../../core/video/edit-video'
import createVideo from '../../core/video/create-video'

const load = loading({
  color: 'yellow',
})

const command: GluegunCommand = {
  name: 'create',
  run: async (toolbox) => {
    const { print, prompt, filesystem } = toolbox

    const profiles = await listProfiles()

    if (!profiles.length) {
      print.error('No profiles found.')
      print.warning(
        'Please enter `tiktoker profile create` to create a profile.'
      )
      return
    }

    const { selectedProfile: selectedProfileText } = await prompt.ask({
      message: 'Which profile do you want to create a video for?',
      name: 'selectedProfile',
      type: 'select',
      choices: profiles.map((profile) => `${profile.name} (${profile.path})`),
    })
    const selectedProfile = profiles.find(
      (profile) => profile.path === selectedProfileText.match(/\((.*)\)/)[1]
    )

    if (!selectedProfile) {
      print.error('Profile not found.')
      return
    }

    const { videoAmountInput } = await prompt.ask({
      message: 'How many videos do you want to create?',
      name: 'videoAmountInput',
      type: 'input',
    })

    const videoAmount = parseInt(videoAmountInput)

    if (isNaN(Number(videoAmount))) {
      print.error('Please enter a valid number.')
      return
    }

    const allEntitiesInProfile = (
      await filesystem.listAsync(selectedProfile.path)
    )
      .map((entityPath) => path.join(selectedProfile.path, entityPath))
      .filter((entityPath) => entityPath.indexOf('.cache') === -1)

    const allFoldersInProfile = allEntitiesInProfile.filter((entityPath) =>
      filesystem.isDirectory(entityPath)
    )

    const videos = await listVideos()

    const allFoldersNotIndexed = allFoldersInProfile.filter(
      (entityPath) => !videos.find((video) => video.path === entityPath)
    )

    if (videoAmount > allFoldersNotIndexed.length) {
      print.error(
        `You only have ${allFoldersNotIndexed.length} videos in your profile.`
      )
      print.warning(
        `If you want to create more videos, please create more folders with any name into your profile path (${selectedProfile.path}). Inside each of these folders add a json file called "info.json" and there add a field called "netflixLink" with the url value of your quick laugh`
      )
      return
    }

    for (let i = 0; i < videoAmount; i++) {
      const videoPath = allFoldersNotIndexed[i]
      const infoVideoPath = path.join(videoPath, 'info.json')
      if (!filesystem.exists(infoVideoPath)) {
        print.error(
          `The folder ${videoPath} does not have a info.json file. Please create one with a field called "netflixLink" with the url value of your quick laugh`
        )
        return
      }
      const videoInfo = JSON.parse(await filesystem.readAsync(infoVideoPath))
      if (!videoInfo.netflixLink) {
        print.error(
          `The file ${infoVideoPath} does not have a field called "netflixLink" with the url value of your quick laugh`
        )
        return
      }

      load.start(`Getting video info ${i + 1} from netflix...`)
      const videoFromNetflix = await getVideoFromNetflix(videoInfo.netflixLink)
      load.stop()
      filesystem.dirAsync(path.join(videoPath, 'raw'))

      const outputPath = {
        video: path.join(videoPath, 'raw', 'video.mp4'),
        audio: path.join(videoPath, 'raw', 'audio.mp4'),
        subtitles: path.join(videoPath, 'raw', 'subtitles.txt'),
        result: path.join(
          videoPath,
          `${videoFromNetflix.title.replace(/[^a-zA-Z 0-9]/gi, '')}${
            videoFromNetflix.description.length ? ' - ' : ''
          }${videoFromNetflix.description.replace(/[^a-zA-Z 0-9]/gi, '')}.mp4`
        ),
      }

      load.start(`Downloading video ${i + 1} from netflix...`)
      await downloadFiles({
        videoUrl: videoFromNetflix.videoUrl,
        audioUrl: videoFromNetflix.audioUrl,
        subtitlesUrl: videoFromNetflix.subtitlesUrl,
        videoOutputPath: outputPath.video,
        audioOutputPath: outputPath.audio,
        subtitlesOutputPath: outputPath.subtitles,
      })
      load.stop()

      load.start(`Making magic in video ${i + 1}...`)
      await editVideo({
        videoFilePath: outputPath.video,
        audioFilePath: outputPath.audio,
        outputFilePath: outputPath.result,
      })
      load.stop()

      load.start(`Creating video ${i + 1} in database...`)
      await createVideo({
        path: videoPath,
        profile: {
          connect: {
            id: selectedProfile.id,
          },
        },
        quickLaughsUrl: videoInfo.netflixLink,
        rawPath: path.join(videoPath, 'raw'),
        name: videoFromNetflix.title,
        description: videoFromNetflix.description,
      })
      load.stop()

      print.info(
        print.colors.green(`I finished the process with video ${i + 1}`)
      )
    }

    print.info(print.colors.green('I finished the process with all videos'))
  },
}

module.exports = command
