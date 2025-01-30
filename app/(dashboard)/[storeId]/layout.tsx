import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createAxiosInstance } from "@/lib/axiosInstance";

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

  const axiosInstance = await createAxiosInstance();

  try {
    const { data: store } = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/stores/${storeId}`
    );

    if (!store) {
      redirect("/");
    }

    return (
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <div className="flex-1 space-y-4 p-4 md:p-8 max-w-full">{children}</div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch store:", error);
    redirect("/");
  }
}
