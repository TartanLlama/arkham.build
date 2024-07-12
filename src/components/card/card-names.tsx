import { cx } from "@/utils/cx";
import { Link } from "wouter";

import css from "./card.module.css";

type Props = {
  code: string;
  isUnique?: boolean;
  linked?: boolean;
  name?: string;
  parallel?: boolean;
  subname?: string;
};

export function CardNames(props: Props) {
  const { code, isUnique, linked, name, parallel, subname } = props;

  const cardName = (
    <>
      {parallel && <i className={cx(css["parallel"], "icon-parallel")} />}
      {name} <span>{isUnique && "✸"}</span>
    </>
  );

  return (
    <div>
      <h1 className={css["name"]}>
        {linked ? <Link href={`/card/${code}`}>{cardName}</Link> : cardName}
      </h1>
      {subname && <h2 className={css["sub"]}>{subname}</h2>}
    </div>
  );
}
