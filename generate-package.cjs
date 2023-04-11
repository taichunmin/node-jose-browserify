const fsPromises = require('fs').promises
const path = require('path')
const _ = require('lodash')

async function run () {
  try {
    const version = _.get(process, ['env', 'JOSE_VERSION'], '')
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`invalid version: ${version}`)
    await fsPromises.mkdir(path.resolve(__dirname, './dist'), { recursive: true })

    // dist/package.json
    const packageJson = JSON.parse(await fsPromises.readFile(path.resolve(__dirname, './src/package.json'), 'utf8'))
    _.set(packageJson, 'version', version)
    await fsPromises.writeFile(path.resolve(__dirname, './dist/package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

    // require('process/')
    const nodeJoseIndexFile = path.resolve(__dirname, './node_modules/node-jose/lib/index.js')
    const nodeJoseIndex = await fsPromises.readFile(nodeJoseIndexFile, 'utf8')
    await fsPromises.writeFile(nodeJoseIndexFile, nodeJoseIndex.replace('require("process")', 'require("process/")'), 'utf8')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()