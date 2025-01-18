import { Check, Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "default",
  admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Copied to clipboard",
      description: "API route copied to clipboard",
    });
    setIsCopied(true);
  };

  return (
    <Alert>
      <AlertTitle className="flex items-center gap-x-2">
        <Server className="h-4 w-4" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between text-sm font-mono font-semibold space-x-2">
        <code className="rounded-md bg-muted p-3 w-full">{description}</code>
        <Button variant="outline" size="icon" type="button" onClick={onCopy}>
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};
