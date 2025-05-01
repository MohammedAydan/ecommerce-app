/**
    {
    "productId": 0,
    "productName": "string",
    "description": "string",
    "price": 0.0,
    "categoryId": 0,
    "sku": "string",
    "stockQuantity": 0, 
    "imageUrl": "string",
    "category": {
        "categoryId": 0,
        "categoryName": "string",
        "parentCategoryId": 0,
        "description": "string"
        }
    }
*/

import CategoryType from "./category-type"

export interface ProductDtoType {
    productId: string | null;
    productName: string | null;
    description: string | null;
    price: number | null;
    categoryId: number | null;
    sku: string | null;
    stockQuantity: number | null;
    imageUrl: string | null;
    discount: number | null;
    salePrice: number | null;
    rating: number | null;
}

export default interface ProductType extends ProductDtoType {
    category?: CategoryType;
}

/*
    productId: string | null;
    productName: string | null;
    description: string | null;
    price: number | null;
    categoryId: number | null;
    sku: string | null;
    stockQuantity: number | null;
    image: file | null;
    discount: number | null;
    rating: number | null;
*/