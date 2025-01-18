"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { TrashIcon } from "lucide-react";
import { Store } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      // check if the store name already exists
      const { data: stores }: { data: Store[] } = await axios.get("/api/stores");
      const storeExists = stores.some(
        (store: Store) => store.name === data.name
      );
      if (storeExists) {
        toast({
          title: "Store name already exists",
          description: "Please choose a different name",
          variant: "destructive",
        });
        return;
      }

      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast({
        title: "Store updated successfully",
        description: "Your store has been updated",
      });

    } catch (error) {

      toast({
        title: "Error",
        description: `Something went wrong: ${error}`,
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // check if the store exists and delete it
      const { data: stores }: { data: Store[] } = await axios.get("/api/stores");
      const storeExists = stores.some(
        (store: Store) => store.id === params.storeId
      );
      
      if (!storeExists) {
        toast({
          title: "Store not found",
          description: "The store you are trying to delete does not exist",
          variant: "destructive",
        });
        return;
      }

      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast({
        title: "Store deleted successfully",
        description: "Your store has been deleted",
      });
    } catch {
      toast({
        title: "Error",
        description: `Make sure you removed all products and categories first.`,
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
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your store settings" />
        <Button
          variant="destructive"
          disabled={loading}
          onClick={() => setOpen(true)}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete Store
        </Button>
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
          <Separator />
          <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${process.env.NEXT_PUBLIC_API_URL}/api/${params.storeId}`}
            variant="public"
          />
        </form>
      </Form>
    </>
  );
};
