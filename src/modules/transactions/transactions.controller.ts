import type {
	AddTransactionRequest,
	AddTransactionResponse,
	GetUserTransactionsRequest,
	GetUserTransactionsResponse
} from '@ciganov/contracts/dist/gen/balance'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { TransactionsService } from './transactions.service'

@Controller()
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@GrpcMethod('BalanceService', 'AddTransaction')
	public async addTransaction(
		data: AddTransactionRequest
	): Promise<AddTransactionResponse> {
		return await this.transactionsService.transaction(data)
	}

	@GrpcMethod('BalanceService', 'GetUserTransactions')
	public async getUserTransactions(
		data: GetUserTransactionsRequest
	): Promise<GetUserTransactionsResponse> {
		return await this.transactionsService.getUserTransactions(data)
	}
}
