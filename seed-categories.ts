import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tagsData = [
    { description: 'hardware' },
    { description: 'perifericos' },
    { description: 'computadores' },
    { description: 'games' },
    { description: 'processadores' },
    { description: 'placas-de-video' },
    { description: 'memoria-ram' },
    { description: 'armazenamento' },
    { description: 'fontes' },
    { description: 'gabinete' },
    { description: 'placa-mae' },
    { description: 'fonte-de-alimentacao' },
    { description: 'cooler' },
    { description: 'acessorios' },
  ];

  console.log('Creating tags...');
  for (const tag of tagsData) {
    const existingTag = await prisma.tag.findFirst({
      where: { description: tag.description },
    });
    
    if (!existingTag) {
      await prisma.tag.create({
        data: tag,
      });
    }
  }

  const allTags = await prisma.tag.findMany();
  const tagMap = new Map(allTags.map((t) => [t.description, t.id]));

  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products.`);

  for (const product of products) {
    const name = product.name.toLowerCase();
    const tagsToLink: string[] = [];

    if (name.includes('processador')) {
      tagsToLink.push('hardware', 'processadores');
    } else if (name.includes('placa de vídeo') || name.includes('rtx')) {
      tagsToLink.push('hardware', 'placas-de-video');
    } else if (name.includes('memória ram')) {
      tagsToLink.push('hardware', 'memoria-ram');
    } else if (name.includes('ssd') || name.includes('armazenamento')) {
      tagsToLink.push('hardware', 'armazenamento');
    } else if (name.includes('gabinete')) {
      tagsToLink.push('hardware', 'gabinete');
    } else if (name.includes('mouse') || name.includes('teclado') || name.includes('monitor')) {
      tagsToLink.push('perifericos');
    } else if (name.includes('notebook') || name.includes('computador')) {
      tagsToLink.push('computadores');
    }

    for (const tagName of tagsToLink) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.productTag.upsert({
          where: {
            productId_tagId: {
              productId: product.id,
              tagId: tagId,
            },
          },
          update: {},
          create: {
            productId: product.id,
            tagId: tagId,
          },
        });
      }
    }
  }

  console.log('Finished seeding categories.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
