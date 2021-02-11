import { connect, Connection } from 'amqplib'

import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit'

import InvalidRabbitConfigException from '../Exceptions/InvalidRabbitConfigException'

export default class ConnectionManager {
  /**
   * Whether the connection has already been established
   */
  public hasConnection: boolean = false

  /**
   * The connection
   */
  private _connection: Connection

  /**
   * The credentials
   */
  private readonly credentials: string

  /**
   * The hostname
   */
  private readonly hostname: string

  constructor(
    private readonly rabbitConfig: RabbitConfig
  ) {
    this.credentials = this.handleCredentials(
      this.rabbitConfig.user,
      this.rabbitConfig.password
    )

    this.hostname = this.handleHostname(
      this.rabbitConfig.hostname,
      this.rabbitConfig.port
    )
  }

  /**
   * Returns the credentials
   *
   * @param user The username
   * @param password The password
   */
  private handleCredentials(
    user: RabbitConfig['user'],
    password: RabbitConfig['password']
  ) {
    if (!user) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ user')
    }

    if (!password) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ password')
    }

    return `${user}:${password}@`
  }

  /**
   * Returns the hostname
   *
   * @param hostname The hostname
   * @param port The port
   */
  private handleHostname(
    hostname: RabbitConfig['hostname'],
    port?: RabbitConfig['port']
  ) {
    if (!hostname) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ hostname')
    }

    if (!port) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ port')
    }

    return port
      ? `${hostname}:${port}`
      : hostname
  }

  /**
   * Returns the connection URL
   */
  public get url() {
    return `amqp://${this.credentials}${this.hostname}`
  }

  /**
   * Returns the connection
   */
  public async getConnection() {
    if (!this._connection) {
      try {
        this._connection = await connect(this.url)
      } catch (error) {
        throw error
      }
    }

    return this._connection
  }

  /**
   * Closes the connection
   */
  public async closeConnection() {
    if (this.hasConnection) {
      await this._connection.close()
      this.hasConnection = false
    }
  }
}
