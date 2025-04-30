import CategorySection from '@/components/category-section'
import HeroSection from '@/components/hero-section'
import ProductsSection from '@/components/products-section'
import React from 'react'

function page() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <ProductsSection />
    </div>
  )
}

export default page