"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormMessage } from "../ui/form";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Store } from "@prisma/client";

// create a schema for the form
const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Check if store name exists in a single request
      const { data: stores }: { data: Store[] } = await axios.get(
        "/api/stores"
      );
      const storeExists = stores.some(
        (store: Store) => store.name.toLowerCase() === values.name.toLowerCase()
      );

      if (storeExists) {
        toast({
          title: "Store name already exists",
          description: "Please choose a different name",
          variant: "destructive",
        });
        return;
      }

      const { data: newStore }: { data: Store } = await axios.post(
        "/api/stores",
        values
      );

      toast({
        title: "Store created successfully",
        description: `Created at: ${newStore.createdAt}`,
      });

      form.reset();
      // Use router.push instead of window.location for better navigation
      window.location.assign(`/${newStore.id}`);
      storeModal.onClose();
    } catch (error) {
      console.error("[STORE_CREATION_ERROR]", error);
      toast({
        title: "Error creating store",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={storeModal.onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
