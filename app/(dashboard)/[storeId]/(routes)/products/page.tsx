import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { createAxiosInstance } from "@/lib/axiosInstance";

export type Product = {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: Date;
  category: {
    name: string;
  };
  size: {
    value: string;
  };
  color: {
    value: string;
  };
  storeId: string;
};

const ProductPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: products } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/products`
  );

  const formattedProducts: ProductColumn[] = products.map((item: Product) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    color: item.color.value,
    size: item.size.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
