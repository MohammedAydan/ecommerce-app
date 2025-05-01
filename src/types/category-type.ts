/**
    {
    "categoryId": 0,
    "categoryName": "string",
    "parentCategoryId": 0,
    "description": "string",
    "products": [
        {
        "productId": 0,
        "productName": "string",
        "description": "string",
        "price": 0.0,
        "categoryId": 0,
        "sku": "string",
        "stockQuantity": 0,
        "imageUrl": "string"
        }
    ]
    }
 */

import { ProductDtoType } from "./product-type"

export interface CategoryDtoType {
    categoryId: number
    categoryName: string
    parentCategoryId: number
    description: string
    imageUrl: string
    itemsCount: number
}

export interface CategoryAndMyProductsBtoType {
    categoryId: number
    categoryName: string
    parentCategoryId: number
    description: string
    imageUrl: string
    itemCount: number
    products: ProductDtoType[]
}


export default interface CategoryType extends CategoryDtoType {
    products: ProductDtoType[]
}


export interface SimpleCategoryType {
    categoryId: number
    categoryName: string
}