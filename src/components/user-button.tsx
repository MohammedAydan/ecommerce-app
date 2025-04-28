"use client"
import { FaRegUser } from "react-icons/fa";
import { Button } from "./ui/button";
import { useAuth } from "@/features/auth/use-auth";
import Image from "next/image";
import Link from "next/link";

const UserButton = () => {
    const { user } = useAuth();

    return (
        <Link href={user ? "/profile" : "/sign-in"}>
            <Button size={"icon"} variant={"outline"} className="overflow-hidden">
                {user ? (
                    user.imageUrl ?
                        (<div className="">
                            <Image
                                src={user.imageUrl!}
                                alt="User image"
                                width={60}
                                height={60}

                            />
                        </div>) : (
                            <FaRegUser className="w-5 h-5" />
                        )
                ) : (<FaRegUser className="w-5 h-5" />)}

            </Button>
        </Link>
    );
}

export default UserButton;