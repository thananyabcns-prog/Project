import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export class JsonFileStore {
  constructor(filePath) {
    this.filePath = path.resolve(process.cwd(), filePath)
  }

  async readAll() {
    try {
      const rawData = await readFile(this.filePath, 'utf8')
      return JSON.parse(rawData)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }

      throw error
    }
  }

  async writeAll(records) {
    await mkdir(path.dirname(this.filePath), { recursive: true })
    await writeFile(this.filePath, JSON.stringify(records, null, 2), 'utf8')
  }
}
