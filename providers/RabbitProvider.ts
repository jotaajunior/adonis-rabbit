import { RabbitConfig, RabbitManagerContract } from '@ioc:Adonis/Addons/Rabbit'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import RabbitManager from '../src/RabbitManager'

export default class RabbitProvider {
  constructor(protected app: ApplicationContract) { }

  public register() {
    this.app.container.singleton('Adonis/Addons/Rabbit', () => {
      const rabbitConfig = this
        .app
        .container
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
    /**
     * Gracefully closes the channel
     */
    this
      .app
      .container
      .with(['Adonis/Addons/Rabbit'], (rabbit: RabbitManagerContract) => {
        rabbit
          .closeChannel()
          .then(() => rabbit.closeConnection())
      })
  }
}
