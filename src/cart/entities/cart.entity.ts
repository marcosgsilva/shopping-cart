import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from './item.entity';


@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: string;

  @Column('text', { array: true })
  items: ItemEntity[];

  @Column({ name: 'totalPrice' })
  totalPrice: number;


}

