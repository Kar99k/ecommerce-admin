import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { createAxiosInstance } from "@/lib/axiosInstance";

type Order = {
  id: string;
  storeId: string;
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: Date;
  orderItems: {
    product: {
      id: string;
      name: string;
      price: string;
    };
  }[];
};

const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const axiosInstance = await createAxiosInstance();

  const { data: orders } = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/${storeId}/orders`
  );

  const formattedOrders: OrderColumn[] = orders.map((item:Order) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    isPaid: item.isPaid,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
