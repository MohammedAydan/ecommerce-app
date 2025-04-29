import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import CartButton from "./cart-button";
import UserButton from "./user-button";

const Header = () => {

    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-background/10 backdrop-blur-sm h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/90">
                            ECommerce
                        </Link>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-1 sm:space-x-4">
                        <Link href="/search">
                            <Button size={"icon"} variant={"outline"}>
                                <IoSearch className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size={"icon"} variant={"outline"}>
                            <FaRegHeart className="w-5 h-5" />
                        </Button>
                        <CartButton />
                        <div className="">
                            <ModeToggle />
                        </div>
                        <UserButton />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
