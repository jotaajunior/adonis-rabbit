import { RabbitConfig, RabbitManagerContract } from '@ioc:Adonis/Addons/Rabbit'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import RabbitManager from '../src/RabbitManager'

export default class RabbitProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Addons/Rabbit', () => {
      const rabbitConfig = this.app.container
        .use('Adonis/Core/Config')
        .get('rabbit', {} as RabbitConfig)

      return new RabbitManager(rabbitConfig)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    const Rabbit: RabbitManagerContract = this.app.container.use(
      'Adonis/Addons/Rabbit'
    )
    await Rabbit.closeChannel()
    await Rabbit.closeConnection()
  }
}
