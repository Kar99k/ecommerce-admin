import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";
import { createAxiosInstance } from "@/lib/axiosInstance";
import { Color } from "@prisma/client";

const ColorsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: colors } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/colors`
  );

  const formattedColors: ColorColumn[] = colors.map((item: Color) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient colors={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
