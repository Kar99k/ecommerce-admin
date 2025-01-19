"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface BillboardClientProps {
  billboards: BillboardColumn[];
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Billboards
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} searchKey="label" />
    </>
  );
};
