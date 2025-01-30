import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";
import { createAxiosInstance } from "@/lib/axiosInstance";
import { Billboard } from "@prisma/client";

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: billboards } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/billboards`
  );
  
  const formattedBillboards: BillboardColumn[] = billboards.map(
    (item: Billboard) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
