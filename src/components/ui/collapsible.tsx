import {
  CollapsibleContentProps,
  CollapsibleProps,
  Content,
  Root,
  Trigger,
} from "@radix-ui/react-collapsible";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ReactNode } from "react";

import css from "./collapsible.module.css";

import { Button } from "./button";

type Props = CollapsibleProps & {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onOpenChange?: (x: boolean) => void;
  sub?: ReactNode;
  title: ReactNode;
};

export function Collapsible({
  actions,
  className,
  children,
  open,
  onOpenChange,
  sub,
  title,
}: Props) {
  return (
    <Root
      className={clsx(css["collapsible-root"], className)}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className={css["collapsible-header"]}>
        <div className={css["collapsible-titles"]}>
          <h4>{title}</h4>
          <div className={css["collapsible-sub"]}>{sub}</div>
        </div>
        <div className={css["collapsible-actions"]}>
          {actions}
          <Trigger asChild>
            <Button variant="bare">
              {open ? <Cross2Icon /> : <RowSpacingIcon />}
            </Button>
          </Trigger>
        </div>
      </div>
      {children}
    </Root>
  );
}

type ContentProps = CollapsibleContentProps & {
  className?: string;
  children: ReactNode;
};

export function CollapsibleContent({ className, children }: ContentProps) {
  return (
    <Content>
      <div className={clsx(css["collapsible-content"], className)}>
        {children}
      </div>
    </Content>
  );
}
