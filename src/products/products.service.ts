import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { tagIds, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { tagIds, ...productData } = updateProductDto;

    // Remove existing relations if tagIds are provided
    if (tagIds) {
      await this.prisma.productTag.deleteMany({
        where: { productId: id },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async incrementSalesQuantity(id: number, quantity: number = 1) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        salesQuantity: {
          increment: quantity,
        },
      },
    });
  }

  async findByTag(tagId: number) {
    return this.prisma.product.findMany({
      where: {
        tags: {
          some: {
            tagId: tagId,
          },
        },
      },
      take: 4,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findByTagName(name: string) {
    return this.prisma.product.findMany({
      where: {
        tags: {
          some: {
            tag: {
              description: {
                contains: name,
              },
            },
          },
        },
      },
      take: 4,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findTopSelling() {
    return this.prisma.product.findMany({
      orderBy: {
        salesQuantity: 'desc',
      },
      take: 4,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findByTagNamePaginated(name: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = {
      tags: {
        some: {
          tag: {
            description: {
              contains: name,
            },
          },
        },
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async search(keyword: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }
}
