import { ColorForm } from "./components/color-form";
import { createAxiosInstance } from "@/lib/axiosInstance";

const ColorPage = async ({
  params,
}: {
  params: Promise<{ colorId: string; storeId: string }>;
}) => {
  const { colorId, storeId } = await params;

  const axiosInstance = await createAxiosInstance();

  const { data: color } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/colors/${colorId}`
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
