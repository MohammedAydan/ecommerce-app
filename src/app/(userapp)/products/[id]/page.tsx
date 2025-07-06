import React from 'react'
import { Star } from 'lucide-react'
import ImageSlider from '@/components/image-slider'
import AddToCartButton from '@/components/add-to-cart-button'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductCard from '@/components/product-card'
import { Separator } from '@/components/ui/separator';
import { getProduct, getCategoryAndProducts } from '@/lib/data/products';
// import { FaRegHeart } from 'react-icons/fa'
// import AddToCartButton from './components/AddToCartButton'
// import WishlistButton from './components/WishlistButton'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        };
    }

    return {
        title: `${product.productName} | E-Commerce Store`,
        description: product.description || 'View product details and pricing',
        openGraph: {
            title: product.productName || '',
            description: product.description || '',
            images: [process.env.NEXT_PUBLIC_API_BASE_URL + "" + product.imageUrl || ''],
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (product == null) {
        return notFound();
    }

    const category = await getCategoryAndProducts(product!.categoryId!, 1, 20);
    console.log(category)


    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <ImageSlider images={[product.imageUrl ?? ""]} />

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-foreground">{product.productName}</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(product.rating ?? 1)
                                        ? 'text-primary fill-primary'
                                        : 'text-foreground/25'
                                        }`}
                                />
                            ))}
                        </div>
                        {/* <span className="text-foreground/60">({0} reviews)</span> */}
                    </div>

                    <div className="text-2xl font-bold text-foreground flex justify-start items-center gap-2">
                        <span className="text-base font-bold text-primary">${product.salePrice ? product.salePrice.toFixed(2) : (product.price ? product.price.toFixed(2) : '0.00')}</span>
                        {product.salePrice && product.price && product.salePrice < product.price && (
                            <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                        )}
                    </div>

                    {/* <p className="text-foreground/60">{product.description}</p> */}

                    <div className="flex gap-4">
                        <AddToCartButton product={product} />
                        {/* <button
                            className="p-3 border border-input rounded-lg hover:bg-accent transition-colors"
                            aria-label="Add to wishlist"
                        > */}
                            {/* <FaRegHeart className="w-5 h-5" /> */}
                        {/* </button> */}
                    </div>

                    {/* Additional Details */}
                    <div className="border-t border-border pt-6 mt-6">
                        <h2 className="font-semibold mb-4 text-foreground">Product Details</h2>
                        <p className="text-foreground/60">{product.description}</p>
                    </div>
                </div>
            </div>

            <Separator className='w-full mt-16'/>

            {category == null ? (
                <div className="flex justify-center">
                    <p>Not found category</p>
                </div>
            ) : (
                <div className="w-full max-w-7xl text-center py-8 sm:py-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                        Category: {category?.categoryName}
                    </h1>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8">
                        {category?.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {category.products.map((product) => (
                            <div className="flex justify-center" key={product.productId}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
