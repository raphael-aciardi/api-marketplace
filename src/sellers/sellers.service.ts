import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivateSellerDto } from './dto/activate-seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async activateSeller(userId: number, dto: ActivateSellerDto) {
    const existingSeller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existingSeller) {
      throw new ConflictException('User is already a seller.');
    }

    return this.prisma.sellerProfile.create({
      data: {
        userId,
        bankDetails: dto.bankDetails,
        billingAddress: dto.billingAddress,
      },
    });
  }

  async getSellerReputation(userId: number) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const reviews = await this.prisma.review.findMany({
      where: {
        sellerId: userId,
        createdAt: {
          gte: oneYearAgo,
        },
      },
    });

    if (reviews.length === 0) return { rating: 0, reviewsCount: 0 };

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    return { 
      rating: Number(averageRating.toFixed(2)), 
      reviewsCount: reviews.length 
    };
  }
}
