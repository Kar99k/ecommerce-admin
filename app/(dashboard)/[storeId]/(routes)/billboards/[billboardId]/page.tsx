import { BillboardForm } from "./components/billboard-form";
import { createAxiosInstance } from "@/lib/axiosInstance";

const BillboardPage = async ({
  params,
}: {
  params: Promise<{ billboardId: string; storeId: string }>;
}) => {
  const { billboardId, storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: billboard } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/billboards/${billboardId}`
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
