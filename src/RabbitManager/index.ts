import { Channel, Options } from 'amqplib'
import {
  MessageContract,
  RabbitConfig,
  RabbitManagerContract,
} from '@ioc:Adonis/Addons/Rabbit'
import ConnectionManager from '../ConnectionManager'
import Message from '../Messsage'
import safeStringify from '../Utils/safeStringify'

export default class RabbitManager implements RabbitManagerContract {
  /**
   * The connection manager
   */
  private readonly connectionManager: ConnectionManager

  /**
   * If the channel has been established
   */
  public hasChannel: boolean = false

  /**
   * The channel
   */
  private _channel: Channel

  constructor(rabbitConfig: RabbitConfig) {
    this.connectionManager = new ConnectionManager(rabbitConfig)
  }

  /**
   * Converts the content to a Buffer
   *
   * @param content The content
   */
  private toBuffer(content: any) {
    return Buffer.isBuffer(content)
      ? content
      : Buffer.from(
          typeof content === 'object' ? safeStringify(content) : content
        )
  }

  /**
   * Returns the connection
   */
  public async getConnection() {
    return this.connectionManager.getConnection()
  }

  /**
   * Returns the channel
   */
  public async getChannel() {
    const connection = await this.connectionManager.getConnection()

    if (!this.hasChannel) {
      this.hasChannel = true
      this._channel = await connection.createChannel()
    }

    return this._channel
  }

  /**
   * Creates a queue if doesn't exist
   *
   * @param queueName The name of the queue
   * @param options The options
   */
  public async assertQueue(queueName: string, options?: Options.AssertQueue) {
    const channel = await this.getChannel()

    return channel.assertQueue(queueName, options)
  }

  /**
   * Sends the message to the queue
   *
   * @param queueName The name of the queue
   * @param content The content
   * @param options The options
   */
  public async sendToQueue(
    queueName: string,
    content: any,
    options?: Options.Publish
  ) {
    const channel = await this.getChannel()

    return channel.sendToQueue(queueName, this.toBuffer(content), options)
  }

  /**
   * Creates an Exchange if doesn't exist
   *
   * @param exchangeName The exchange name
   * @param type The exchange type
   * @param content The content
   */
  public async assertExchange(
    exchangeName: string,
    type: string,
    options?: Options.AssertExchange
  ) {
    const channel = await this.getChannel()

    return channel.assertExchange(exchangeName, type, options)
  }

  /**
   * Binds a queue and an exchange
   *
   * @param queueName The queue name
   * @param exchangeName The exchange name
   * @param pattern The pattern
   */
  public async bindQueue(
    queueName: string,
    exchangeName: string,
    pattern = ''
  ) {
    const channel = await this.getChannel()

    return channel.bindQueue(queueName, exchangeName, pattern)
  }

  /**
   * Sends a message to an exchange
   *
   * @param exchangeName The exchange name
   * @param routingKey A routing key
   * @param content The content
   */
  public async sendToExchange(
    exchangeName: string,
    routingKey: string,
    content: any
  ) {
    const channel = await this.getChannel()

    return channel.publish(exchangeName, routingKey, this.toBuffer(content))
  }

  /**
   * Acknowledges all messages
   */
  public async ackAll() {
    const channel = await this.getChannel()

    return channel.ackAll()
  }

  /**
   * Rejects all messages
   *
   * @param requeue Adds back to the queue
   */
  public async nackAll(requeue: boolean) {
    const channel = await this.getChannel()

    return channel.nackAll(requeue)
  }

  /**
   * Consumes messages from a queue
   *
   * @param queueName The queue name
   * @param onMessage The listener
   */
  public async consumeFrom<T extends object = any>(
    queueName: string,
    onMessage: (msg: MessageContract<T>) => void | Promise<void>
  ) {
    const channel = await this.getChannel()

    return channel.consume(queueName, (message) => {
      const messageInstance = new Message<T>(channel, message)
      onMessage(messageInstance)
    })
  }

  /**
   * Closes the channel
   */
  public async closeChannel() {
    if (this.hasChannel) {
      await this._channel.close()
      this.hasChannel = false
    }
  }

  /**
   * Closes the connection
   */
  public async closeConnection() {
    await this.connectionManager.closeConnection()
  }
}
