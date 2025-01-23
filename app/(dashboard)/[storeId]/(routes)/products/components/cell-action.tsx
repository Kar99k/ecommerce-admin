"use client";

import { Button } from "@/components/ui/button";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast({
      title: "Product ID copied to clipboard",
    });
  };

  const onUpdate = () => {
    router.push(`${pathname}/${data.id}`);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${pathname}/${data.id}`);
      router.refresh();
      toast({
        title: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete product",
        description: "Please try again: " + error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={loading}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onCopy}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={onUpdate}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:!text-white hover:!bg-red-500"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
