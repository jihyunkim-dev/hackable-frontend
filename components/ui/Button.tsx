import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:bg-interaction-disable disabled:text-gray-400",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        outline:
          "border border-gray-200 bg-white text-primary-500 hover:bg-primary-50",
        gradient:
          "bg-linear-[99deg] from-rose-500 from-3% to-primary-500 to-98% text-white shadow-sm hover:opacity-90",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-label-l",
        md: "h-10 rounded-lg px-4 text-label-l font-bold",
        lg: "h-12 rounded-lg px-5 text-label-l font-bold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
