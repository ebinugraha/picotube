import { auth } from "@/lib/auth";
import AuthLayout from "@/modules/auth/ui/layouts/auth-layout"
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {

const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    )
}

export default Layout