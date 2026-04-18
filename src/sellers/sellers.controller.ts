import { Controller, Post, Body, Get, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { ActivateSellerDto } from './dto/activate-seller.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sellers')
@UseGuards(JwtAuthGuard)
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post('activate')
  activate(@Request() req, @Body() activateSellerDto: ActivateSellerDto) {
    return this.sellersService.activateSeller(req.user.sub, activateSellerDto);
  }

  @Get(':id/reputation')
  getReputation(@Param('id', ParseIntPipe) id: number) {
    return this.sellersService.getSellerReputation(id);
  }
}
