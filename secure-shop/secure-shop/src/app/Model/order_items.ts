import { product } from './product.model';

export class order_items {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product_details: product;
    constructor(id: number,
        order_id: number,
        product_id: number,
        quantity: number,
        price: number,
        product_details: product) {
        this.id = id;
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.price = price;
        this.product_details = product_details;
    }


}
