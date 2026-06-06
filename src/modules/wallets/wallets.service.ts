import {
	CreateWalletRequest,
	CreateWalletResponse,
	GetBalanceRequest,
	GetBalanceResponse
} from '@ciganov/contracts/dist/gen/balance'
import { Injectable } from '@nestjs/common'

import { WalletsRepository } from './wallets.repository'

@Injectable()
export class WalletsService {
	constructor(private readonly repo: WalletsRepository) {}

	public async getWalletByUserId(
		data: GetBalanceRequest
	): Promise<GetBalanceResponse> {
		const { userId } = data
		const response = await this.repo.getByUserId(userId)
		return {
			balance: {
				id: response.id,
				bonusBalance: response.bonusBalance.toNumber(),
				freezeBalance: response.freezeBalance.toNumber(),
				mainBalance: response.mainBalance.toNumber()
			}
		}
	}

	public async createWallet(
		data: CreateWalletRequest
	): Promise<CreateWalletResponse> {
		const { userId } = data
		await this.repo.create({ id: userId })
		return {
			ok: true
		}
	}
}
