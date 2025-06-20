import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Laptop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  cpu: string;

  @Column()
  ram: string;

  @Column()
  storage: string;

  @Column()
  gpu: string;

  @Column()
  screen_size: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string; // gaming, office, design, student

  @Column('text')
  description: string;

  @Column()
  in_stock: boolean;
}