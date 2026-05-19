import { PROTO_PATHS } from '@ciganov/contracts'
import { GrpcOptions } from '@nestjs/microservices'

export const grpcPackages = ['balance.v1']

// export const grpcProtoPaths = [PROTO_PATHS.BALANCE]

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
}
