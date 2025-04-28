import { CategoryBtoType } from "@/types/category-type"
import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  category: CategoryBtoType
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/categories/${category.categoryId}`} className="group relative w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 rounded-2xl overflow-hidden border bg-background shadow-sm hover:shadow-lg transition-all">
      <div className="">
        <div className="relative w-full aspect-square">
          <Image
            src={category.imageUrl}
            alt={category.categoryName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 text-white">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1">{category.categoryName}</h3>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-2">{category.description}</p>
          {category.itemsCount != null && (
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm lg:text-base backdrop-blur-md">
              {category.itemsCount} item{category.itemsCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
