import { DataSource } from 'typeorm';
import { seedLaptops } from './seed-laptops';

async function runSeeding() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Allforone@123',
    database: 'demo',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await seedLaptops(dataSource);
    
    await dataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeeding(); 