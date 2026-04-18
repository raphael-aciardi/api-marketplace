import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('tag/:tagId')
  findByTag(@Param('tagId') tagId: string) {
    return this.productsService.findByTag(+tagId);
  }

  @Get('search/tag/:name/paginated')
  findByTagNamePaginated(
    @Param('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.productsService.findByTagNamePaginated(name, +page, +limit);
  }

  @Get('search/tag/:name')
  findByTagName(@Param('name') name: string) {
    return this.productsService.findByTagName(name);
  }

  @Get('search/keyword/:q')
  search(@Param('q') q: string) {
    return this.productsService.search(q);
  }

  @Get('top-selling')
  findTopSelling() {
    return this.productsService.findTopSelling();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Patch(':id/sell')
  sell(@Param('id') id: string) {
    return this.productsService.incrementSalesQuantity(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
