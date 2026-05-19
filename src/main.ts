import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './core/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	await app.listen(config.getOrThrow<number>('HTTP_PORT'))
}
bootstrap()
