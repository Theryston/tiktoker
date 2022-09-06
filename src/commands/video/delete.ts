import { GluegunCommand } from 'gluegun'
import deleteVideo from '../../core/video/delete-video'
import listVideos from '../../core/video/list-videos'

const command: GluegunCommand = {
  name: 'delete',
  description: 'delete a video',
  run: async (toolbox) => {
    const { prompt, print, filesystem } = toolbox

    const videos = await listVideos()

    if (!videos.length) {
      print.error('No videos found.')
      print.warning('Please enter `tiktoker video create` to create a video.')
      return
    }

    const { selectedVideoText } = await prompt.ask({
      message: 'Which video do you want to delete?',
      name: 'selectedVideoText',
      type: 'select',
      choices: videos.map((video) => `${video.name} (${video.path})`),
    })
    const selectedVideo = videos.find(
      (video) => video.path === selectedVideoText.match(/\((.*)\)/)[1]
    )

    const areYouSure = await prompt.confirm(
      `Are you sure you want to delete this video?`
    )

    if (!areYouSure) {
      print.info('Video not deleted.')
      return
    }

    await filesystem.removeAsync(selectedVideo.path)

    await deleteVideo(selectedVideo.id)

    print.info(
      '\n' + print.colors.green(`Video ${selectedVideo.id} deleted!`) + '\n'
    )
  },
}

module.exports = command
