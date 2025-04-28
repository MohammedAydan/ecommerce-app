"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"

function ImageSlider({
    images
}: {
    images: string[]
}) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right'>('right')

    useEffect(() => {
        if (images.length == 1) return;
        const interval = setInterval(() => {
            setDirection('right')
            setSelectedImage((prev) => (prev + 1) % images.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [images])

    const handleImageChange = (index: number) => {
        setDirection(index > selectedImage ? 'right' : 'left')
        setSelectedImage(index)
    }

    return (
        <div className="w-full">
            <div className="space-y-4">
                <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
                    <div
                        className={cn(
                            "absolute inset-0 transition-transform duration-500 ease-in-out",
                            direction === 'right' ? 'animate-slide-left' : 'animate-slide-right'
                        )}
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={images[selectedImage]}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            className={cn(
                                "relative h-20 w-20 rounded-md overflow-hidden transition-all duration-200",
                                "hover:opacity-90 hover:scale-105",
                                selectedImage === index && "ring-2 ring-blue-500 scale-105"
                            )}
                            onClick={() => handleImageChange(index)}
                        >
                            <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ImageSlider