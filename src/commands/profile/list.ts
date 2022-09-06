import { GluegunCommand } from 'gluegun'
import listProfiles from '../../core/profile/list-profiles'

const command: GluegunCommand = {
  name: 'list',
  description: 'list all profiles',
  run: async (toolbox) => {
    const { print } = toolbox

    const profiles = await listProfiles()

    if (!profiles.length) {
      print.warning('No profiles found.')
      print.warning(
        'Please enter `tiktoker profile create` to create a profile.'
      )
      return
    }

    const rows = [['Id', 'Name', 'Path']]
    for (const profile of profiles) {
      rows.push([profile.id, profile.name, profile.path])
    }

    print.table(rows, {
      format: 'lean',
    })
  },
}

module.exports = command
