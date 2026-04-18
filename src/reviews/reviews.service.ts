import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(buyerId: number, dto: CreateReviewDto) {
    if (buyerId === dto.sellerId) {
      throw new BadRequestException('You cannot review yourself.');
    }

    const seller = await this.prisma.user.findUnique({
      where: { id: dto.sellerId },
      include: { sellerProfile: true },
    });

    if (!seller || !seller.sellerProfile) {
      throw new NotFoundException('Seller not found or user is not an active seller.');
    }

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        sellerId: dto.sellerId,
        buyerId,
      },
    });
  }
}
