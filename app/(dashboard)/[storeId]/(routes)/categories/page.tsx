import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import { createAxiosInstance } from "@/lib/axiosInstance";
import { Billboard, Category } from "@prisma/client";

interface CategoryWithBillboard extends Category {
  billboard: Billboard;
}

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: categories } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/categories`
  );
  
  const formattedCategories: CategoryColumn[] = categories.map(
    (item: CategoryWithBillboard) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
