import * as React from "react";
import { Slot } from "./slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-paper shadow-editorial hover:bg-flame hover:text-white hover:-translate-y-0.5",
        flame:
          "bg-flame text-white shadow-editorial hover:bg-flame-dark hover:-translate-y-0.5",
        outline:
          "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
        outlineGold:
          "border border-flame/60 bg-transparent text-ink hover:bg-flame hover:text-white hover:border-flame",
        light:
          "bg-paper text-ink shadow-editorial hover:bg-white hover:-translate-y-0.5",
        ghost: "text-ink hover:bg-ink/5",
        navy: "bg-navy text-white hover:bg-navy-light shadow-sm",
        link: "text-ink underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-5",
        lg: "h-[3.25rem] px-8 py-3.5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
