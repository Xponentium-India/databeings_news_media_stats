import * as React from "react";

/**
 * Minimal Slot implementation (radix-free): merges the given props onto its
 * single React child instead of rendering a wrapper element. Used by Button's
 * `asChild` so a <Link> can receive the button styling directly.
 */
export const Slot = React.forwardRef<HTMLElement, { children?: React.ReactNode } & Record<string, unknown>>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      className: [props.className, child.props.className].filter(Boolean).join(" "),
      ref,
    });
  }
);
Slot.displayName = "Slot";
