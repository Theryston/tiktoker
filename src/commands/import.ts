import { profiles } from '@prisma/client'
import { GluegunCommand } from 'gluegun'
import createProfile from '../core/profile/create-profile'
import listProfiles from '../core/profile/list-profiles'
import * as path from 'path'
import listVideos from '../core/video/list-videos'
import createVideo from '../core/video/create-video'

const command: GluegunCommand = {
  name: 'import',
  description: 'import existents files and folder to tiktoker',
  run: async (toolbox) => {
    const { prompt, filesystem, print } = toolbox

    let { pathToImport } = await prompt.ask({
      message:
        'In which directory will all your profile data be stored? (ex: C:\\Users\\username\\Documents\\TikTok)',
      name: 'pathToImport',
      type: 'input',
    })

    if (['.', './', ''].includes(pathToImport)) {
      pathToImport = filesystem.cwd()
    }

    const profiles = await listProfiles({ path: pathToImport })

    let profile: profiles = profiles[0]

    if (!profile) {
      const { name } = await prompt.ask({
        message: 'What is the name of the profile you want to create?',
        name: 'name',
        type: 'input',
      })

      profile = await createProfile({ path: pathToImport, name })
    }

    const allEntitiesInProfile = (await filesystem.listAsync(profile.path))
      .map((entityPath) => path.join(profile.path, entityPath))
      .filter((entityPath) => entityPath.indexOf('.cache') === -1)

    const allFoldersInProfile = allEntitiesInProfile.filter((entityPath) =>
      filesystem.isDirectory(entityPath)
    )

    for (const folder of allFoldersInProfile) {
      const subEntities = (await filesystem.listAsync(folder))
        .map((entityPath) => path.join(folder, entityPath))
        .filter((entityPath) => entityPath.indexOf('.cache') === -1)

      const hasVideos = subEntities.some(
        (entityPath) => entityPath.indexOf('.mp4') !== -1
      )
      const hasVideoFolder = subEntities.some(
        (entityPath) =>
          filesystem.isDirectory(entityPath) &&
          entityPath.indexOf('video') !== -1
      )
      const hasIgnoreFolder = subEntities.some(
        (entityPath) =>
          filesystem.isDirectory(entityPath) &&
          entityPath.indexOf('IGNORE-VIDEO') !== -1
      )

      const videos = await listVideos({
        path: folder,
      })

      if (
        ((hasVideos && !hasIgnoreFolder) ||
          (hasVideoFolder && !hasIgnoreFolder)) &&
        !videos.length
      ) {
        let name: string
        if (hasVideoFolder) {
          const videosInVideoFolder = (
            await filesystem.listAsync(path.join(folder, 'video'))
          )
            .map((entityPath) => path.join(folder, 'video', entityPath))
            .filter((entityPath) => entityPath.indexOf('.cache') === -1)
            .filter((entityPath) => entityPath.indexOf('.mp4') !== -1)
          name = path.basename(videosInVideoFolder[0].replace('.mp4', ''))
        } else {
          const videosInCurrentFolder = subEntities
            .filter((entityPath) => entityPath.indexOf('.cache') === -1)
            .filter((entityPath) => entityPath.indexOf('.mp4') !== -1)
          name = path.basename(videosInCurrentFolder[0].replace('.mp4', ''))
        }

        await createVideo({
          rawPath: folder,
          path: folder,
          description: '',
          name,
          quickLaughsUrl: '',
          profile: {
            connect: {
              id: profile.id,
            },
          },
        })

        print.success(`Video ${name} (${folder}) imported!`)
      }
    }
  },
}

module.exports = command
