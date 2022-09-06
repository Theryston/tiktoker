import { GluegunCommand } from 'gluegun'
import deleteProfile from '../../core/profile/delete-profile'
import listProfiles from '../../core/profile/list-profiles'

const command: GluegunCommand = {
  name: 'delete',
  description: 'delete a profile',
  run: async (toolbox) => {
    const { prompt, print, filesystem } = toolbox

    const profiles = await listProfiles()

    if (!profiles.length) {
      print.error('No profiles found.')
      print.warning(
        'Please enter `tiktoker profile create` to create a profile.'
      )
      return
    }

    const { selectedProfileText } = await prompt.ask({
      message: 'Which profile do you want to delete?',
      name: 'selectedProfileText',
      type: 'select',
      choices: profiles.map((profile) => `${profile.name} (${profile.path})`),
    })
    const selectedProfile = profiles.find(
      (profile) => profile.path === selectedProfileText.match(/\((.*)\)/)[1]
    )

    const areYouSure = await prompt.confirm(
      `Are you sure you want to delete this profile?`
    )

    if (!areYouSure) {
      print.info('Profile not deleted.')
      return
    }

    await filesystem.removeAsync(selectedProfile.path)

    await deleteProfile(selectedProfile.id)

    print.info(
      '\n' + print.colors.green(`Profile ${selectedProfile.id} deleted!`) + '\n'
    )
  },
}

module.exports = command
