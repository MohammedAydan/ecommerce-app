import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { ProductDtoType } from "@/types/product-type";

interface ProductCardProps {
    product: ProductDtoType;
}

const ProductCard = ({
    product: {
        productId,
        productName,
        description,
        price,
        stockQuantity,
        imageUrl,
        discount,
        salePrice,
        rating,
    }
}: ProductCardProps) => {
    const formattedDiscount = discount ? discount.toFixed(0) : null;
    const formattedRating = rating ? rating.toFixed(1) : null;

    return (
        <Link
            href={`/products/${productId}`}
            className="group w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 bg-background border rounded-2xl shadow-md overflow-hidden transition-all hover:bg-primary/5 hover:shadow-lg hover:border-primary"
        >
            <div className="relative w-full aspect-square bg-background/5 dark:bg-background/10">
                <Image
                    src={`${imageUrl ?? ""}`}
                    alt={`${imageUrl}${productId}`} // To make each image unique
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {formattedDiscount && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-semibold">
                        -{formattedDiscount}% OFF
                    </div>
                )}

                {formattedRating && (
                    <div className="absolute top-3 left-3 bg-background/30 backdrop-blur-sm p-1 px-2 rounded-full flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < (rating ?? 1) ? "text-primary fill-primary" : "text-muted-foreground"}`}
                            />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({formattedRating})</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between gap-2">
                <h3 className="text-base md:text-lg font-semibold text-primary line-clamp-2">
                    {productName}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

                <div className="flex justify-between items-center mt-2">
                    {/* <div className="flex items-center gap-2">
                        {salePrice ? (
                            <>
                                <span className="text-base font-bold text-primary">${salePrice.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground line-through">${price?.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-primary">${price?.toFixed(2)}</span>
                        )}
                    </div> */}
                    <div className="flex items-center justify-start gap-2">
                        <span className="text-base font-bold text-primary">${salePrice ? salePrice.toFixed(2) : (price ? price.toFixed(2) : '0.00')}</span>
                        {salePrice && price && salePrice < price && (
                            <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">{stockQuantity} in stock</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
