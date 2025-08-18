import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModal } from "./studio-upload-modal";

export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white h-16 flex items-center px-2 pr-5 z-50 shadow-md">
      <div className="flex items-center gap-4 w-full">
        {/* menu and logo */}
        <div className="flex flex-1 items-center shrink-0">
          <SidebarTrigger />
          <Link href={"/studio"}>
            <div className="flex p-4 items-center font-semibold">
              <Image
                src="/logo.svg"
                alt="Pico Tube Logo"
                width={24}
                height={24}
                className="mr-2"
              />
              <p className="text-xl font-bold">Studio</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
