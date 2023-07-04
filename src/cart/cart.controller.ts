import { Controller, Post, Body, Request, UseGuards, Delete, NotFoundException, Param } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CartService } from './cart.service';
import { ItemDTO } from '../user/dtos/item.dto';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Post('/')
    async addItemToCart(@Request() req, @Body() itemDTO: ItemDTO) {
        const userId = req.user.userId;
        console.log(userId)
        itemDTO.price = itemDTO.price
        const cart = await this.cartService.addItemToCart(userId, itemDTO);
        return cart;
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/removed/:productId')
    async removeItemFromCart(@Request() req) {
        const userId = req.user.userId;
        const cart = await this.cartService.removeItemFromCart(userId, req.params.productId);
        return cart;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.User)
    @Delete('/:id')
    async deleteCart(@Param('id') userId: string) {
        const cart = await this.cartService.deleteCart(userId);
        if (!cart) throw new NotFoundException('Cart does not exist');
        return cart;
    }
}
