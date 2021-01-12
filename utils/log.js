const fs = require('fs')
const path = require('path')

function createWriteStream() {
  const fullFileName = path.resolve(__dirname, '..', 'logs', 'access.log')
  const writeSteam = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })

  return writeSteam
}

module.exports = createWriteStream
