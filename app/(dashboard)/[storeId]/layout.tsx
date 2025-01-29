import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}>) {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 max-w-full">
        {children}
      </div>
    </div>
  );
}
