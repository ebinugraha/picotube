import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
    return (
       <nav className="fixed top-0 left-0 right-0 bg-white h-16 flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                {/* menu and logo */}
                <div className="flex items-center shrink-0">
                    <SidebarTrigger/>
                    <Link href={'/'}>
                        <div className="flex p-4 items-center font-semibold">
                                <Image
                                    src="/logo.svg"
                                    alt="Pico Tube Logo"
                                    width={24}
                                    height={24}
                                    className="mr-2"
                                />
                            <p className="text-xl font-bold">Pico Tube</p>
                        </div>
                    </Link>
                </div>
                {/* search bar */}
                <div className="justify-center flex-1 max-w-7xl mx-auto flex">
                    <SearchInput/>
                </div>

                <div className="flex items-center gap-4">
                    <AuthButton/>
                </div>

            </div>
       </nav>
    );
}