import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Makes the Adonis RabbitMQ config file
 */
function makeConfig(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic,
) {
  const configDirectory = app.directoriesMap.get('config') || 'config'
  const configPath = join(configDirectory, 'rabbit.ts')

  const template = new sink.files.MustacheFile(
    projectRoot,
    configPath,
    join(__dirname, 'templates', 'rabbit.txt')
  )

  if (template.exists()) {
    sink
      .logger
      .skip(`${configPath} already exists`)
    return
  }

  template.commit()

  sink
    .logger
    .create(configPath, 'create')
}

/**
 * Instructions to be executed when setting up the package.
 */
export default function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  makeConfig(projectRoot, app, sink)
}
