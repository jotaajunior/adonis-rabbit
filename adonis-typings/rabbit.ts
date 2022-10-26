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
     * If the channel has been established
     */
    hasChannel: boolean

    /**
     * Returns the connection
     */
    getConnection(): Promise<Connection>

    /**
     * Returns the channel
     */
    getChannel(): Promise<Channel>

    /**
     * Creates a queue if doesn't exist
     *
     * @param queueName The name of the queue
     * @param options The options
     */
    assertQueue(
      queueName: string,
      options?: Options.AssertQueue
    ): Promise<Replies.AssertQueue>

    /**
     * Send the message to the queue
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
     * Creates an exchange if doesn't exist
     *
     * @param exchangeName The exchange name
     * @param type The exchange type
     * @param content The content
     */
    assertExchange(
      exchangeName: string,
      type: string,
      options?: Options.AssertExchange
    ): Promise<Replies.AssertExchange>

    /**
     * Binds a queue and an exchange
     *
     * @param queueName The queue name
     * @param exchangeName The exchange
     * @param pattern The pattern
     */
    bindQueue(
      queueName: string,
      exchangeName: string,
      pattern?
    ): Promise<Replies.Empty>

    /**
     * Sends a message to an exchange
     *
     * @param exchangeName The exchange name
     * @param routingKey A routing key
     * @param content The content
     */
    sendToExchange(
      exchangeName: string,
      routingKey: string,
      content: any
    ): Promise<boolean>

    /**
     * Acknowledges all messages
     */
    ackAll(): Promise<void>

    /**
     * Rejects all messages
     *
     * @param requeue Adds back to the queue
     */
    nackAll(requeue?: boolean): void | Promise<void>

    /**
     * Consumes message from a queue
     *
     * @param queueName The queue name
     * @param onMessage The listener
     */
    consumeFrom<T extends object = any>(
      queueName: string,
      onMessage: (msg: MessageContract<T>) => void | Promise<void>
    ): Promise<Replies.Consume>

    /**
     * Closes the channel
     */
    closeChannel(): Promise<void>

    /**
     * Closes the connection
     */
    closeConnection(): Promise<void>
  }
  export interface MessageContract<T extends object = any> {
    /**
     * Acknowledges the message
     *
     * @param allUpTo Acknowledges all the messages up to this
     */
    ack(allUpTo?): void

    /**
     * Rejects the message
     *
     * @param allUpTo Acknowledges all the messages up to this
     * @param requeue Adds back to the queue
     */
    nack(allUpTo?, requeue?): void

    /**
     * Rejects the message. Equivalent to nack, but work in older
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
     * @example supersecretpassword1234
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
    port?: number

    /**
     * The RabbitMQ protocol
     *
     * @default "amqp"
     */
    protocol?: string
  }

  const Rabbit: RabbitManagerContract

  export default Rabbit
}
