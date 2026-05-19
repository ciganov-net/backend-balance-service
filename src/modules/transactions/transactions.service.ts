import {
	type AddTransactionRequest,
	type AddTransactionResponse,
	GetUserTransactionsRequest,
	GetUserTransactionsResponse,
	TransactionType
} from '@ciganov/contracts/dist/gen/balance'
import { convertEnum, RpcStatus } from '@ciganov/core'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Decimal } from '@prisma/client/runtime/client.js'
import {
	TransactionType as PrismaTransactionType,
	Wallet
} from '@prisma/generated/client'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class TransactionsService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getUserTransactions(
		data: GetUserTransactionsRequest
	): Promise<GetUserTransactionsResponse> {
		const { userId } = data
		const transactions = await this.prismaService.transaction.findMany({
			where: {
				walletId: userId
			}
		})
		return {
			transactions: transactions.map(value => ({
				id: value.id,
				type: convertEnum(TransactionType, value.type as any),
				amount: value.amount.toNumber(),
				eventId: value.eventId,
				createdAt: {
					seconds: Math.floor(value.createdAt.getTime() / 1000),
					nanos: (value.createdAt.getTime() % 1000) * 1e6
				}
			}))
		}
	}

	public async transaction(
		data: AddTransactionRequest
	): Promise<AddTransactionResponse> {
		const { amount, type, eventId, userId, multiplier } = data

		if (amount <= 0)
			throw new RpcException({
				code: RpcStatus.CANCELLED,
				details: 'Amount must be greater than zero'
			})
		try {
			return await this.prismaService.$transaction(async tx => {
				const wallets = await tx.$queryRaw<Wallet[]>`
          SELECT * FROM "wallets" 
          WHERE "userId" = ${userId} 
          FOR UPDATE
        `
				let wallet = wallets[0]

				if (!wallet)
					throw new RpcException({
						code: RpcStatus.NOT_FOUND,
						details: 'Wallet not found'
					})

				let mainBalance = new Decimal(wallet.mainBalance)
				let freezeBalance = new Decimal(wallet.freezeBalance)
				let bonusBalance = new Decimal(wallet.bonusBalance)

				switch (type) {
					case TransactionType.WITHDRAW:
						if (mainBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient funds'
							})
						}
						mainBalance = mainBalance.minus(amount)
						break
					case TransactionType.DEPOSIT:
						mainBalance = mainBalance.plus(amount)
						break
					case TransactionType.BET_FREEZE:
						if (mainBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient funds'
							})
						}
						mainBalance = mainBalance.minus(amount)
						freezeBalance = freezeBalance.plus(amount)
						break
					case TransactionType.BET_WIN:
						if (freezeBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient funds'
							})
						}
						const coefficient = new Decimal(multiplier || 1)
						const betAmount = new Decimal(amount)
						const totalWin = betAmount.times(coefficient)
						freezeBalance = freezeBalance.minus(betAmount)
						mainBalance = mainBalance.plus(totalWin)
						break
					case TransactionType.BET_LOSE:
						if (freezeBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient frozen funds to process lose'
							})
						}
						freezeBalance = freezeBalance.minus(amount)
						break
					case TransactionType.BONUS:
						if (bonusBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient bonus funds'
							})
						}
						bonusBalance = bonusBalance.minus(amount)
						freezeBalance = freezeBalance.plus(amount)
						break
					case TransactionType.REFUND:
						if (freezeBalance.lt(amount)) {
							throw new RpcException({
								code: RpcStatus.FAILED_PRECONDITION,
								details: 'Insufficient frozen funds to process lose'
							})
						}
						freezeBalance = freezeBalance.minus(amount)
						mainBalance = mainBalance.plus(amount)
						break
					default:
						throw new RpcException({
							code: RpcStatus.INVALID_ARGUMENT,
							details: `Unsupported argument: ${type}`
						})
				}
				await tx.wallet.update({
					where: { id: userId },
					data: {
						mainBalance,
						freezeBalance,
						bonusBalance
					}
				})

				await tx.transaction.create({
					data: {
						wallet: { connect: { id: userId } },
						amount,
						type: convertEnum(PrismaTransactionType, type),
						eventId
					}
				})
				return {
					ok: true
				}
			})
		} catch (e) {
			throw new RpcException({
				code: RpcStatus.INTERNAL,
				details: 'Internal transaction error'
			})
		}
	}
}
