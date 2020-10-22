import { Channel, ConsumeMessage } from 'amqplib'

import { MessageContract } from '@ioc:Adonis/Addons/Rabbit'

import NullMessageException from '../Exceptions/NullMessageException'

export default class Message<T extends object = any> implements MessageContract {
  public message: ConsumeMessage

  constructor(
    private channel: Channel,
    message: ConsumeMessage | null
  ) {
    if (message === null) {
      throw new NullMessageException('Message expected, received null.')
    }

    /**
     * If the Message isn't null, then we can store
     * it
     */
    this.message = message
  }

  /**
   * Acknowledge the message
   *
   * @param allUpTo Acknowledge all the messages up to this
   */
  public ack(allUpTo = false) {
    this.channel.ack(this.message, allUpTo)
  }

  /**
   * Rejects the message
   *
   * @param allUpTo Acknowledge all the messages up to this
   * @param requeue Adds back to the queue
   */
  public nack(allUpTo = false, requeue = true) {
    this.channel.nack(this.message, allUpTo, requeue)
  }

  /**
   * Rejects the message. Equivalent to nack, but worker in older
   * versions of RabbitMQ, where nack does not
   *
   * @param requeue Adds back to the queue
   */
  public reject(requeue = true) {
    this.channel.reject(this.message, requeue)
  }

  /**
   * The message content
   */
  public get content() {
    return this.message.content.toString()
  }

  /**
   * The parsed message as JSON object
   */
  public get jsonContent() {
    return JSON.parse(this.content) as T
  }

  /**
   * The message fields
   */
  public get fields() {
    return this.message.fields
  }

  /**
   * The message properties
   */
  public get properties() {
    return this.message.properties
  }
}
