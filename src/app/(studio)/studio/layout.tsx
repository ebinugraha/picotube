import { auth } from "@/lib/auth";
import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
