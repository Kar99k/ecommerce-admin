// convert to colors page
import { prismadb } from "@/lib/prismadb";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = await params;
  const colors = await prismadb.color.findMany({
    where: {
      storeId: storeId,
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
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
