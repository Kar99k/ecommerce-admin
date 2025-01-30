import { CategoryForm } from "./components/category-form";
import { createAxiosInstance } from "@/lib/axiosInstance";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string; storeId: string }>;
}) => {
  const { categoryId, storeId } = await params;

  const axiosInstance = await createAxiosInstance();

  const { data: category } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/categories/${categoryId}`
  );

  const { data: billboards } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/billboards`
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
