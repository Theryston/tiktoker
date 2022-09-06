import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'tiktoker',
  description: 'tiktoker help',
  run: async (toolbox) => {
    const { runtime } = toolbox

    runtime.run('help')
  },
}

module.exports = command
