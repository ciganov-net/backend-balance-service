import { PrismaPg } from '@prisma/adapter-pg'
import { Decimal } from '@prisma/client/runtime/client'
import * as dotenv from 'dotenv'

import { PrismaClient, Transaction, Wallet } from './generated/client'

dotenv.config({
	path: '.env.production.local'
})

const adapter = new PrismaPg({
	user: process.env.DATABASE_USER!,
	password: process.env.DATABASE_PASSWORD!,
	host: process.env.DATABASE_HOST!,
	port: Number(process.env.DATABASE_PORT!),
	database: process.env.DATABASE_NAME!
})

const prisma = new PrismaClient({ adapter })

const WALLETS: Wallet[] = [
	{
		//вадим
		id: 'c7TZMqTRfHd5h7A3M5Fjn',
		bonusBalance: new Decimal(99999),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(99999),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		//кирик
		id: 'xnLWWxD_EJs4x_ppmgfdC',
		bonusBalance: new Decimal(99999),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(99999),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		//ярослейв
		id: 'Ks5-83ykyihsvSqkinBF5',
		bonusBalance: new Decimal(99999),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(99999),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		// вадич
		id: 'kxKqrnAfyD7tSQYCpDM32',
		bonusBalance: new Decimal(99999),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(99999),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		// диман
		id: 'eOM6mazeykaTsZBQdySVs',
		bonusBalance: new Decimal(99999),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(99999),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		// мелстрой
		id: 'xujNktIqrMWy2i2pbc124',
		bonusBalance: new Decimal(0),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(10000),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		// трамп
		id: 'JNdquv_PmkNpgmu8UQTEj',
		bonusBalance: new Decimal(500),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(100000),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		// евелон
		id: 'xkes9LGPE4kBytCSe1JBX',
		bonusBalance: new Decimal(0),
		freezeBalance: new Decimal(0),
		mainBalance: new Decimal(9232),
		createdAt: new Date(),
		updatedAt: new Date()
	}
]

// const TRANSACTION: Transaction[] = [
// 	{
// 		// мелстрой
// 		walletId: 'xujNktIqrMWy2i2pbc124',
// 		amount: new Decimal(10000),
// 		type: 'BET_FREEZE',
// 		eventId: '',
// 		id: 'SLjC_UccJ93Zsn7tgU9GC',
// 		createdAt: new Date()
// 	},
// 	{
// 		// мелстрой
// 		walletId: 'xujNktIqrMWy2i2pbc124',
// 		amount: new Decimal(10000),
// 		type: 'BET_LOSE',
// 		eventId: '',
// 		id: 'SLjC_UccJ93Zsn7tgU9GC',
// 		createdAt: new Date()
// 	},
// 	{
// 		// трамп
// 		id: 'JNdquv_PmkNpgmu8UQTEj',
// 		bonusBalance: new Decimal(500),
// 		freezeBalance: new Decimal(0),
// 		mainBalance: new Decimal(100000),
// 		createdAt: new Date(),
// 		updatedAt: new Date()
// 	},
// 	{
// 		// евелон
// 		id: 'xkes9LGPE4kBytCSe1JBX',
// 		bonusBalance: new Decimal(0),
// 		freezeBalance: new Decimal(0),
// 		mainBalance: new Decimal(9232),
// 		createdAt: new Date(),
// 		updatedAt: new Date()
// 	}
// ]

async function seed() {
	console.log('Seeder started')

	try {
		await prisma.$transaction(async tx => {
			await tx.transaction.deleteMany()
			await tx.wallet.deleteMany()
			await tx.wallet.createMany({
				data: WALLETS
			})
		})
		console.log('Seeder successfully completed')
	} catch (e) {
		console.log('Seeder failed')
		console.log(e)
		process.exit(1)
	}
}

seed()
