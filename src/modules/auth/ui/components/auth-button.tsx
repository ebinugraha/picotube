import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";

export const AuthButton = () => {
    return (
        <Button className="rounded-full text-blue-500 font-semibold" variant={"outline"}>
            <UserCircle2/>
            Sign In
        </Button>
    );
}  