"use client";

import { Store } from "@prisma/client";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useStoreModal } from "@/hooks/use-store-modal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items,
}: StoreSwitcherProps) {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const StoreModal = useStoreModal();

  const formattedItems = items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems?.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("w-[200px] justify-between", className)}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandList>
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems?.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandItem
            onSelect={() => {
              setOpen(false);
              StoreModal.onOpen();
            }}
            className="cursor-pointer"
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Store
          </CommandItem>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
