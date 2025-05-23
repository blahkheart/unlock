import handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'

export const prepare = (content, opts = {}) => {
  const images = []
  handlebars.registerHelper('inlineImage', function (filename) {
    const [name, extension] = filename.split('.')
    const path = join(__dirname, `/../../../static/attachments/${filename}`)
    let mimeType = 'image/png'
    if (extension === 'svg') {
      mimeType = 'svg+xml'
    }
    if (opts?.context === 'web') {
      // Read file as base64, serve1
      return `data:image/${mimeType};base64,${readFileSync(path, 'base64')}`
    } else {
      images.push({
        filename,
        path,
        cid: filename, //same cid value as in the html img src
      })
      return `cid:${filename}`
    }
  })

  const template = handlebars.compile(content)
  return [template, () => images]
}

export default prepare
