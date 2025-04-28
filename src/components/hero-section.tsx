import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    backgroundImage?: string;
}

export default function HeroSection({
    title = "Welcome to My Website",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    buttonText = "Get Started",
    backgroundImage = "/images/bg.jpg"
}: HeroSectionProps) {
    return (
        <section className="relative w-full h-screen bg-background overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt="Background Image"
                    fill
                    priority
                    quality={100}
                    className="object-cover object-center"
                    style={{ filter: 'blur(5px) brightness(0.5)' }}
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex flex-col justify-center items-center h-full space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center text-white">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-center text-gray-100 max-w-2xl">
                        {description}
                    </p>
                    <Link href={"#categories"}>
                        <Button
                            className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg rounded-lg transition-all duration-300"
                        >
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
