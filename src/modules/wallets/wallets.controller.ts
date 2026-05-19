import { Controller } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Controller()
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
}
