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
   * The Connection Manager
   */
  private readonly connectionManager: ConnectionManager

  /**
   * If the Channel has been established
   */
  public hasChannel: boolean = false

  /**
   * The Channel
   */
  private _channel: Channel

  constructor(rabbitConfig: RabbitConfig) {
    this.connectionManager = new ConnectionManager(rabbitConfig)
  }

  /**
   * Convert the content to a Buffer
   *
   * @param content The content
   */
  private toBuffer(content: any) {
    return Buffer.isBuffer(content)
      ? content
      : Buffer.from(
        typeof content === 'object'
          ? safeStringify(content)
          : content
      )
  }

  /**
   * Returns the Connection
   */
  public async getConnection() {
    return this
      .connectionManager
      .getConnection()
  }

  /**
   * Returns the Channel
   */
  public async getChannel() {
    const connection = await this
      .connectionManager
      .getConnection()

    if (!this.hasChannel) {
      this.hasChannel = true
      this._channel = await connection.createChannel()
    }

    return this._channel
  }

  /**
   * Creates a Queue if doesn't exists
   *
   * @param queueName The name of the queue
   * @param options The options
   */
  public async assertQueue(
    queueName: string,
    options?: Options.AssertQueue
  ) {
    const channel = await this.getChannel()

    return channel.assertQueue(queueName, options)
  }

  /**
   * Send the message to the Queue
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
   * Creates an Exchange if doesn't exists
   *
   * @param exchangeName O nome do exchange
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
   * Bind a Queue and an Exchange
   *
   * @param queueName The Queue name
   * @param exchangeName The Exchange
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
   * Envia a mensagem para um exchange
   *
   * @param exchangeName O nome da exchange
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
   * Acknowledge all messages
   */
  public async ackAll() {
    const channel = await this.getChannel()

    return channel.ackAll()
  }

  /**
   * Reject all messages
   *
   * @param requeue Adds back to the queue
   */
  public async nackAll(requeue: boolean) {
    const channel = await this.getChannel()

    return channel.nackAll(requeue)
  }

  /**
   * Consome as mensagens de uma fila
   *
   * @param queueName O nome da fila
   * @param onMessage O listener
   */
  public async consumeFrom<T extends object = any>(
    queueName: string,
    onMessage: (msg: MessageContract<T>) => void | Promise<void>
  ) {
    const channel = await this.getChannel()

    return channel.consume(queueName, (message) => {
      const messageInstance = new Message(channel, message)
      onMessage(messageInstance)
    })
  }

  /**
   * Closes the Channel
   */
  public async closeChannel() {
    if (this.hasChannel) {
      await this._channel.close()
      this.hasChannel = false
    }
  }

  /**
   * Closes the Connection
   */
  public async closeConnection() {
    await this
      .connectionManager
      .closeConnection()
  }
}
