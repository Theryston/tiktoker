import { build, filesystem, print } from 'gluegun'

async function run(argv) {
  const cli = build()
    .brand('tiktoker')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'tiktoker-*', hidden: true })
    .help()
    .version()
    .create()

  const isConfigCommand = argv.includes('config')
  if (!isConfigCommand) {
    const envPath = filesystem.path(__dirname, '..', '.env')
    if (!filesystem.exists(envPath)) {
      print.error(
        'TikToker is not configured, run "tiktoker config" to configure it'
      )
      return
    }
  }

  const toolbox = await cli.run(argv)

  return toolbox
}

module.exports = { run }
