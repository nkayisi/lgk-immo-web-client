
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database schema...');
  
  try {
    // Tenter de lire les colonnes de la table users via une requête brute
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `;
    
    console.log('Columns in "users" table:', result);

    // Tenter une lecture Prisma standard
    console.log('Attempting Prisma findFirst...');
    const user = await prisma.user.findFirst();
    console.log('Prisma findFirst result:', user);
    
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
