import { ProductForm } from "./components/product-form";
import { createAxiosInstance } from "@/lib/axiosInstance";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}) => {
  const { productId, storeId } = await params;
  const axiosInstance = await createAxiosInstance();

  const { data: product } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/products/${productId}`
  );

  const { data: categories } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/categories`
  );

  const { data: sizes } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/sizes`
  );

  const { data: colors } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/colors`
  );

  const serializedProduct = product
    ? {
        ...product,
        price: parseFloat(product.price.toString()), // Convert Decimal to number
      }
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={serializedProduct}
        />
      </div>
    </div>
  );
};

export default ProductPage;
