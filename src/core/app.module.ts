import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { PrismaModule } from '@/infrastructure/prisma/prisma.module'
import { TransactionsModule } from '@/modules/transactions/transactions.module'
import { WalletsService } from '@/modules/wallets/wallets.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				`.env`
			]
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.LOG_LEVEL,
				transport: {
					target: 'pino/file',
					options: {
						destination: '/var/log/services/balance/balance.log',
						mkdir: true
					}
				},
				messageKey: 'msg',
				customProps: () => ({
					service: 'balance-service'
				})
			}
		}),
		PrismaModule,
		WalletsService,
		TransactionsModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
