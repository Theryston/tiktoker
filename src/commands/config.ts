import { GluegunCommand } from 'gluegun'
import loading = require('loading-cli')
import * as path from 'path'

const load = loading({
  color: 'yellow',
})

const command: GluegunCommand = {
  name: 'config',
  description: 'generate inicial config',
  run: async (toolbox) => {
    const { print, prompt, filesystem, system } = toolbox

    print.info(
      `TikToker is installed and ready to config! (don't cancel this process, if you do, run 'tiktoker config')\n`
    )

    const { databasePath } = await prompt.ask({
      type: 'input',
      name: 'databasePath',
      message:
        'Where do you want to store the database? (ex: C:\\Users\\username\\tiktoker\\database.db) if you already have used tiktoker, enter the same used path',
    })

    const env = `DATABASE_URL=file:${databasePath}`
    const envPath = path.join(__dirname, '..', '..', '.env')
    filesystem.write(envPath, env)
    const installedBasePath = path.join(__dirname, '..', '..')
    const basePrismaPath = path.join(
      installedBasePath,
      'node_modules',
      '.bin',
      'prisma'
    )
    const schemaPrismaPath = path.join(
      installedBasePath,
      'prisma',
      'schema.prisma'
    )
    const baseDotenvCliPath = path.join(
      installedBasePath,
      'node_modules',
      '.bin',
      'dotenv'
    )

    load.start('Running database migrations...')
    if (!filesystem.exists(databasePath)) {
      filesystem.dirAsync(path.dirname(databasePath))
    }

    await system.run(
      `${baseDotenvCliPath} -e ${envPath} -- ${basePrismaPath} migrate deploy --schema ${schemaPrismaPath} && ${baseDotenvCliPath} -e ${envPath} -- ${basePrismaPath} generate --schema ${schemaPrismaPath}`
    )
    load.stop()

    print.success('TikToker is ready to use!')
  },
}

module.exports = command
