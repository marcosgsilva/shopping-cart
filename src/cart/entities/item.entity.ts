
import { Entity, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';


@Entity({ name: 'item' })
export class ItemEntity {
  @PrimaryColumn()
  productId: string;

  name: string;

  quantity: number;

  price: number;

  subTotalPrice: number;

}

