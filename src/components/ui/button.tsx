import clsx from "clsx";
import type { ComponentProps, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import css from "./button.module.css";

type Props<T extends "a" | "button" | "summary" | "label"> =
  ComponentProps<T> & {
    as?: T;
    children: ReactNode;
    className?: string;
    variant?: "bare" | "secondary";
    size?: "sm" | "lg" | "full";
  };

export const Button = forwardRef(function Button<
  T extends "a" | "button" | "summary" | "label",
>({ as, children, variant, size, ...rest }: Props<T>, ref: ForwardedRef<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element: any = as ?? "button";

  return (
    <Element
      {...rest}
      className={clsx(
        css["button"],
        variant && css[variant],
        size && css[size],
        rest.className,
      )}
      ref={ref}
    >
      {children}
    </Element>
  );
});
