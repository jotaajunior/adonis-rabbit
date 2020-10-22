declare module '@ioc:Adonis/Addons/Rabbit' {
  import {
    Channel,
    Connection,
    MessageFields,
    MessageProperties,
    Options,
    Replies,
  } from 'amqplib'

  export interface RabbitManagerContract {
    /**
     * If the Channel has been established
     */
    hasChannel: boolean

    /**
     * Returns the Connection
     */
    getConnection(): Promise<Connection>

    /**
     * Returns the Channel
     */
    getChannel(): Promise<Channel>

    /**
     * Creates a Queue if doesn't exists
     *
     * @param queueName The name of the queue
     * @param options The options
     */
    assertQueue(
      queueName: string,
      options?: Options.AssertQueue
    ): Promise<Replies.AssertQueue>

    /**
     * Send the message to the Queue
     *
     * @param queueName The name of the queue
     * @param content The content
     * @param options The options
     */
    sendToQueue(
      queueName: string,
      content: any,
      options?: Options.Publish
    ): Promise<boolean>

    /**
     * Creates an Exchange if doesn't exists
     *
     * @param exchangeName O nome do exchange
     * @param type The exchange type
     * @param content The content
     */
    assertExchange(
      exchangeName: string,
      type: string,
      options?: Options.AssertExchange
    ): Promise<Replies.AssertExchange>

    /**
     * Bind a Queue and an Exchange
     *
     * @param queueName The Queue name
     * @param exchangeName The Exchange
     * @param pattern The pattern
     */
    bindQueue(
      queueName: string,
      exchangeName: string,
      pattern?
    ): Promise<Replies.Empty>

    /**
     * Envia a mensagem para um exchange
     *
     * @param exchangeName O nome da exchange
     * @param routingKey A routing key
     * @param content The content
     */
    sendToExchange(
      exchangeName: string,
      routingKey: string,
      content: any
    ): Promise<boolean>

    /**
     * Acknowledge all messages
     */
    ackAll(): Promise<void>

    /**
     * Reject all messages
     *
     * @param requeue Adds back to the queue
     */
    nackAll(requeue?: boolean): void | Promise<void>

    /**
     * Consome as mensagens de uma fila
     *
     * @param queueName O nome da fila
     * @param onMessage O listener
     */
    consumeFrom<T extends object = any>(
      queueName: string,
      onMessage: (msg: MessageContract<T>) => void | Promise<void>
    ): Promise<Replies.Consume>

    /**
     * Closes the Channel
     */
    closeChannel(): Promise<void>

    /**
     * Closes the Connection
     */
    closeConnection(): Promise<void>
  }
  export interface MessageContract<T extends object = any> {
    /**
     * Acknowledge the message
     *
     * @param allUpTo Acknowledge all the messages up to this
     */
    ack(allUpTo?): void

    /**
     * Rejects the message
     *
     * @param allUpTo Acknowledge all the messages up to this
     * @param requeue Adds back to the queue
     */
    nack(allUpTo?, requeue?): void

    /**
     * Rejects the message. Equivalent to nack, but worker in older
     * versions of RabbitMQ, where nack does not
     *
     * @param requeue Adds back to the queue
     */
    reject(requeue?): void

    /**
     * The message content
     */
    content: string

    /**
     * The parsed message as JSON object
     */
    jsonContent: T

    /**
     * The message fields
     */
    fields: MessageFields

    /**
     * The message properties
     */
    properties: MessageProperties
  }

  export interface RabbitConfig {
    /**
     * The RabbitMQ user
     *
     * @example admin
     */
    user?: string

    /**
   * The RabbitMQ password
   *
   * @example admin
   */
    password?: string

    /**
   * The RabbitMQ hostname
   *
   * @example localhost
   */
    hostname: string

    /**
   * The RabbitMQ port
   */
    port: number
  }

  const Rabbit: RabbitManagerContract

  export default Rabbit
}
