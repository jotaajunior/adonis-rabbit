# Adonis RabbitMQ

RabbitMQ provider for Adonis v5, it's a wrapper using [amqplib](https://github.com/squaremo/amqp.node) as core.

## Setup

### Install

Install `adonis-rabbit`.

```
yarn add adonis-rabbit
```

Then:

```
node ace invoke adonis-rabbit
```

### Configuration

After installing and invoking Adonis RabbitMQ, your `tsconfig.json`, `.adonisrc.json`, `.env` and `.env.example` will be modified. Also, `config/rabbit.ts` will be created.

Please certify that the data in `.env` and `config/rabbit.ts` is correct.

## Usage

Once the the Setup steps have been completed, you should be able to use Adonis RabbitMQ.

### Notes

You don't need to create a connection or a channel, Adonis RabbitMQ will handle it automatically for you as soon as you invoke any publishing function.

Anyway, you can still use `await Rabbit.getChannel()` to get direct access to the amqp's `Channel` instance, if the Channel doesn't exists, it'll be created.

You can also use `await Rabbit.getConnection()` to get direct access to the amqp's `Connection` instance. The connection will be established during the Adonis boot.

> This documentation is complementary to the [Amqp's documentation](http://www.squaremobius.net/amqp.node/). Please read their documentation first.

### RabbitMQ Manager

#### Import

```ts
import Rabbit from '@ioc:Adonis/Addons/Rabbit'
```

#### `assertQueue()`

```ts
await Rabbit.assertQueue('myQueue')
```

Assert the Queue is created.

Parameters:

1. `queueName`: the name of the queue
2. `options?`: the queue options

#### `assertExchange()`

```ts
await Rabbit.assertExchange('myQueue', 'type')
```

Assert the Exchange is created.

Parameters:

1. `queueName`: the name of the Queue
2. `type`: the type of the Exchange
3. `options?`: the queue options

#### `bindQueue()`

```ts
await Rabbit.bindQueue('myQueue', 'myExchange', '')
```

Binds a Queue and an Exchange
.
1. `queueName`: the name of the Queue
2. `exchangeName`: the name of the Exchange
3. `pattern?`: the pattern (default to `''`)


#### `sendToQueue()`

```ts
await Rabbit.sendToQueue('myQueue', 'content')
```

Parameters:

1. `queueName`: the name of the Queue
2. `content`: the content to be send to the Queue
3. `options`: the options

Notice that the `content` parameter don't need to be a Buffer, Adonis RabbitMQ will automatically convert it to a Buffer if it isn't already.

You also don't have to `JSON.stringify` an object, Adonis RabbitMQ will also do that for you (it'll be transformed to JSON then to Buffer).

#### `sendToExchange()`

```ts
await Rabbit.sendToExchange('myExchange', 'myRoutingKey', 'content')
```

Parameters:

1. `exchangeName`: the name of the Exchange
2. `routingKey`: the routing key
3. `content`: the content to be send to the Exchange
4. `options`: the options

Notice that the `content` parameter doesn't need to be a Buffer, Adonis RabbitMQ will automatically convert it to a Buffer if it is'nt already.

You also don't have to `JSON.stringify` an object, Adonis RabbitMQ will also do that for you (it'll be transformed to JSON then to Buffer).

#### `consumeFrom()`

```ts
await Rabbit.consumeFrom('myQueue', (message) => {
  console.log(message.content)
  message.ack()
})
```

Consume a message from a queue.

1. `queueName`: the name of the queue
2. `onMessage` the callback which will be executed on the message receive.

The `onMessage` callback receives a <a href="#message">`Message`</a> instance as parameter. 

#### `ackAll()`

```ts
await Rabbit.ackAll()
```

Acknowledges all the messages.

#### `nackAll()`

```ts
await Rabbit.nackAll()
```

Reject all the messages.

Parameters:
1. `requeue?` adds the rejected messages to Queue again.

#### `closeChannel()`

Closes the Channel.


#### `closeConnection()`

Closes the connection.

---

### Message

#### `content`

```ts
message.content
```

Returns the message content.

#### `jsonContent`

```ts
message.jsonContent
```

If the message is expected to be in JSON format, then you can use `message.jsonContent` to get the message parsed as an object.

#### `fields`

```ts
message.fields
```

The message fields.

#### `properties`

```ts
message.properties
```

The message properties

#### `ack()`

```ts
message.ack()
```

Acknowledges the message.

1. `allUpTo?` acknowledges all the messages up to this.

#### `nack()`

```ts
message.nack()
```

Rejects the message.

Parameters:
1. `allUpTo?` rejects all the messages up to this.
1. `requeue?` adds the rejected messages to Queue again.

#### `reject()`

```ts
message.nack()
```

Rejects the message, equivalent to `nack`, but works in older versions of RabbitMQ where `nack` does not.


Parameters:
1. `requeue?` adds the rejected messages to Queue again.

## Roadmap

- [ ] Add SSL options in `config/rabbit.ts`
- [ ] Tests
