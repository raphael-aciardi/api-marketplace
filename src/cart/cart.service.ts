import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.prisma.cart.upsert({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        productId,
        userId,
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    return this.prisma.cart.delete({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });
  }

  async updateQuantity(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    return this.prisma.cart.update({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      data: {
        quantity,
      },
    });
  }

  async clearCart(userId: number) {
    return this.prisma.cart.deleteMany({
      where: { userId },
    });
  }
}
