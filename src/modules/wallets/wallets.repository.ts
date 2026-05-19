import { RpcStatus } from '@ciganov/core'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Wallet } from '@prisma/generated/client'
import { WalletCreateInput, WalletUpdateInput } from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class WalletsRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async getByUserId(userId: string): Promise<Wallet | null> {
		const wallet = await this.prismaService.wallet.findUnique({
			where: {
				id: userId
			}
		})
		if (!wallet)
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Users wallet not found'
			})
		return wallet
	}

	public async create(data: WalletCreateInput): Promise<Wallet | null> {
		return await this.prismaService.wallet.create({
			data
		})
	}

	public async update(
		id: string,
		data: WalletUpdateInput
	): Promise<Wallet | null> {
		return await this.prismaService.wallet.update({
			where: {
				id
			},
			data
		})
	}
}
