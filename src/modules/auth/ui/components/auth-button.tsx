import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { UserCircle2 } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserButton } from "./user-button";
import Link from "next/link";

export const AuthButton = async () => {


    const session = await auth.api.getSession({
        headers: await headers(),
      });
    

    return (
        <>
            
                {session ? (
                    <UserButton/>
                ) : (
                    <Button className="rounded-full text-blue-500 font-semibold" variant={"outline"}>
                        <Link href="/sign-in" className="flex items-center gap-2">
                            <UserCircle2 className="w-5 h-5" />
                            Sign In
                        </Link>
                    </Button>
                )}
        </>
    );
}  