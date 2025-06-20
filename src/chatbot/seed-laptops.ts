import { DataSource } from 'typeorm';
import { Laptop } from './laptop.entity';

const sampleLaptops: Partial<Laptop>[] = [
  {
    name: 'ROG Strix G15',
    brand: 'ASUS',
    cpu: 'Intel Core i7-12700H',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    gpu: 'NVIDIA RTX 3060 6GB',
    screen_size: '15.6 inch FHD 144Hz',
    price: 24990000,
    category: 'gaming',
    description: 'Laptop gaming hiệu năng cao với thiết kế gaming đặc trưng của ROG',
    in_stock: true
  },
  {
    name: 'ThinkPad X1 Carbon',
    brand: 'Lenovo',
    cpu: 'Intel Core i5-1240P',
    ram: '16GB LPDDR5',
    storage: '512GB SSD',
    gpu: 'Intel Iris Xe Graphics',
    screen_size: '14 inch 2.2K IPS',
    price: 32990000,
    category: 'office',
    description: 'Laptop doanh nhân cao cấp với độ bền chuẩn quân đội',
    in_stock: true
  },
  {
    name: 'MacBook Pro M2',
    brand: 'Apple',
    cpu: 'Apple M2',
    ram: '16GB Unified Memory',
    storage: '512GB SSD',
    gpu: 'Apple M2 GPU',
    screen_size: '14 inch Liquid Retina XDR',
    price: 39990000,
    category: 'design',
    description: 'Laptop cao cấp với hiệu năng xuất sắc cho công việc đồ họa',
    in_stock: true
  },
  {
    name: 'Inspiron 15',
    brand: 'Dell',
    cpu: 'Intel Core i5-1235U',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    gpu: 'Intel Iris Xe Graphics',
    screen_size: '15.6 inch FHD',
    price: 15990000,
    category: 'student',
    description: 'Laptop học tập với giá cả phải chăng',
    in_stock: true
  },
  {
    name: 'Legion 5 Pro',
    brand: 'Lenovo',
    cpu: 'AMD Ryzen 7 6800H',
    ram: '16GB DDR5',
    storage: '1TB SSD',
    gpu: 'NVIDIA RTX 3070 8GB',
    screen_size: '16 inch QHD 165Hz',
    price: 29990000,
    category: 'gaming',
    description: 'Laptop gaming hiệu năng cao với màn hình QHD',
    in_stock: true
  },
  {
    name: 'ZenBook 14',
    brand: 'ASUS',
    cpu: 'Intel Core i7-1260P',
    ram: '16GB LPDDR5',
    storage: '512GB SSD',
    gpu: 'Intel Iris Xe Graphics',
    screen_size: '14 inch OLED 2.8K',
    price: 27990000,
    category: 'office',
    description: 'Laptop văn phòng cao cấp với màn hình OLED tuyệt đẹp',
    in_stock: true
  },
  {
    name: 'MSI Creator Z16',
    brand: 'MSI',
    cpu: 'Intel Core i7-12700H',
    ram: '32GB DDR5',
    storage: '1TB SSD',
    gpu: 'NVIDIA RTX 3060 6GB',
    screen_size: '16 inch QHD+ Touch',
    price: 35990000,
    category: 'design',
    description: 'Laptop chuyên dụng cho thiết kế đồ họa',
    in_stock: true
  },
  {
    name: 'HP Pavilion 15',
    brand: 'HP',
    cpu: 'AMD Ryzen 5 5600H',
    ram: '8GB DDR4',
    storage: '512GB SSD',
    gpu: 'NVIDIA GTX 1650 4GB',
    screen_size: '15.6 inch FHD',
    price: 18990000,
    category: 'student',
    description: 'Laptop đa năng phù hợp cho học tập và giải trí',
    in_stock: true
  }
];

export async function seedLaptops(dataSource: DataSource) {
  const laptopRepository = dataSource.getRepository(Laptop);
  
  // Clear existing data
  await laptopRepository.clear();
  
  // Insert new data
  for (const laptop of sampleLaptops) {
    await laptopRepository.save(laptop);
  }
  
  console.log('Sample laptop data has been seeded successfully!');
} 