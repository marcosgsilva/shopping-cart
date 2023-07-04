import { Injectable, NotFoundException } from '@nestjs/common';
import { CartEntity } from './entities/cart.entity';
import { ItemDTO } from '../user/dtos/item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(@InjectRepository(CartEntity) private readonly cartRepo: Repository<CartEntity>) { }

  async createCart(userId: string, itemDTO: ItemDTO, subTotalPrice: number, totalPrice: number): Promise<CartEntity> {
    const newCart = await this.cartRepo.create({
      userId,
      items: [{ ...itemDTO, subTotalPrice }],
      totalPrice
    });

    return await this.cartRepo.save(newCart);
  }

  async getCart(userId: string): Promise<any> {
    const cart = await this.cartRepo.findOne({ where: { userId: userId } });

    if (cart) {
      cart.items.map((item, index) => {
        cart.items[index] = JSON.parse(item.toString())
      })
    }
    return cart;

  }

  async deleteCart(userId: string): Promise<any> {
    const result = await this.cartRepo.delete({ userId: userId });

    return result;

  }

  private recalculateCart(cart: CartEntity) {
    cart.totalPrice = 0;
    cart.items.forEach(item => {
      cart.totalPrice += (item.quantity * item.price);
    })
  }

  async addItemToCart(userId: string, itemDTO: ItemDTO): Promise<CartEntity> {
    const { productId, quantity, price } = itemDTO;
    const subTotalPrice = quantity * Number(price);

    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.productId == productId);

      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);
        item.subTotalPrice = item.quantity * item.price;

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
        return this.cartRepo.save(cart);

      } else {
        cart.items.push({ ...itemDTO, subTotalPrice });
        this.recalculateCart(cart);
        return this.cartRepo.save(cart);
      }
    } else {
      const newCart = await this.createCart(userId, itemDTO, subTotalPrice, price);
      return newCart;
    }
  }

  async removeItemFromCart(userId: string, productId: string): Promise<any> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);


    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      return this.cartRepo.save(cart);
    }
    return cart;
  }
}
