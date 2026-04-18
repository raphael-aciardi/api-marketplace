import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  addToCart(
    @Request() req,
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity') quantity?: number,
  ) {
    return this.cartService.addToCart(req.user.id, productId, quantity);
  }

  @Delete(':productId')
  removeFromCart(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Patch(':productId')
  updateQuantity(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(req.user.id, productId, quantity);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
