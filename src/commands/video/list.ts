import { GluegunCommand } from 'gluegun'
import listVideos from '../../core/video/list-videos'

const command: GluegunCommand = {
  name: 'list',
  run: async (toolbox) => {
    const { print } = toolbox

    const videos = await listVideos()

    if (!videos.length) {
      print.warning('No videos found.')
      print.warning('Please enter `tiktoker video create` to create a video.')
      return
    }

    const rows = []
    for (const video of videos) {
      rows.push([
        'Id: ' + video.id,
        'Name: ' + video.name,
        video.description.length
          ? 'Description: ' + video.description
          : 'Description: None',
        'ProfileId: ' + video.profileId,
        'Path: ' + video.path,
        'QuickLaughsUrl: ' + video.quickLaughsUrl,
      ])
    }

    rows.forEach((columns) => {
      columns.forEach((column) => {
        print.info(column)
      })
      print.divider()
    })
  },
}

module.exports = command
