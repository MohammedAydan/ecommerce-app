/**
{
  "cartId": 0,
  "userId": "string",
  "cartItems": [
    {
      "cartItemId": 0,
      "productId": 0,
      "quantity": 0,
      "product": {
        "productId": 0,
        "productName": "string",
        "price": 0.0
        // other product properties
      }
    }
  ]
}
 */

import { ProductDtoType } from "./product-type";

export default interface CartType {
    cartId: string | null;
    userId: string | null;
    cartItems: CartItemType[];
}

export interface CartItemType {
    cartItemId: string | null;
    productId: string | null;
    quantity: number | null;
    product: ProductDtoType | null;
}