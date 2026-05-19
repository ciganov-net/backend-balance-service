import type {
	GetBalanceRequest,
	GetBalanceResponse
} from '@ciganov/contracts/dist/gen/balance'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { WalletsService } from './wallets.service'

@Controller()
export class WalletsController {
	constructor(private readonly walletsService: WalletsService) {}

	@GrpcMethod('BalanceService', 'GetBalance')
	public async getUserWallet(
		data: GetBalanceRequest
	): Promise<GetBalanceResponse> {
		return await this.walletsService.getWalletByUserId(data)
	}
}
