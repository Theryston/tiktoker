import { GluegunCommand } from 'gluegun'
import createProfile from '../../core/profile/create-profile'

const command: GluegunCommand = {
  name: 'create',
  description: 'create a new profile',
  run: async (toolbox) => {
    const { prompt, print, filesystem } = toolbox

    print.info(`Let's create a TikTok profile for you!\n`)

    const { name } = await prompt.ask({
      message: 'What is the name of the profile you want to create?',
      name: 'name',
      type: 'input',
    })

    let { path } = await prompt.ask({
      message:
        'In which directory will all your profile data be stored? (ex: C:\\Users\\username\\Documents\\TikTok)',
      name: 'path',
      type: 'input',
    })

    if (['.', './', ''].includes(path)) {
      path = filesystem.cwd()
    }

    if (!filesystem.exists(path)) {
      filesystem.dirAsync(path)
    }

    const profile = await createProfile({ path, name })

    print.info(
      '\n' + print.colors.green(`Profile ${profile.name} created!`) + '\n'
    )

    for (const key in profile) {
      print.info(`${key}: ${profile[key]}`)
    }
  },
}

module.exports = command
