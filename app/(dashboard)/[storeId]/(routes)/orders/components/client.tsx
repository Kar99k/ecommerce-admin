"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  orders: OrderColumn[];
}

export const OrderClient = ({ orders }: OrderClientProps) => {

  return (
    <>
        <Heading
          title={`Orders (${orders.length})`}
          description="Manage orders for your store"
        />
       
      <Separator />
      <DataTable columns={columns} data={orders} searchKey="products" />
      
    </>
)};
