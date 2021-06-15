import Env from '@ioc:Adonis/Core/Env'
import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit'

const rabbitConfig: RabbitConfig = {
  hostname: Env.get('RABBITMQ_HOSTNAME', 'localhost') as string,

  user: Env.get('RABBITMQ_USER') as string,

  password: Env.get('RABBITMQ_PASSWORD') as string,

  port: Number(Env.get('RABBITMQ_PORT')),
}

export default rabbitConfig
