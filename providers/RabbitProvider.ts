import { IocContract } from '@adonisjs/fold'
import { RabbitConfig, RabbitManagerContract } from '@ioc:Adonis/Addons/Rabbit'

import RabbitManager from '../src/RabbitManager'

export default class RabbitProvider {
  constructor(protected container: IocContract) { }

  public register() {
    this.container.singleton('Adonis/Addons/Rabbit', () => {
      const rabbitConfig = this
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
      .container
      .with(['Adonis/Addons/Rabbit'], (rabbit: RabbitManagerContract) => {
        rabbit
          .closeChannel()
          .then(() => rabbit.closeConnection())
      })
  }
}
