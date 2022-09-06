// eslint-disable-next-line
const { execSync } = require('child_process')

try {
  execSync('prisma generate')
} catch (error) {
  console.log('Prisma generate failed', error)
}

try {
  execSync('tiktoker config')
} catch (e) {
  console.log('Has an error to run "tiktoker config", please run it manually')
}
