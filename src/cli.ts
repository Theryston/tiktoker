import { build } from 'gluegun'

async function run(argv) {
  const cli = build()
    .brand('tiktoker')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'tiktoker-*', hidden: true })
    .help()
    .version()
    .create()
  const toolbox = await cli.run(argv)

  return toolbox
}

module.exports = { run }
