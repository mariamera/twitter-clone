import React, { ReactElement } from "react";
import Head from "next/head";

type Props = {
  title: string;
  description: string;
};

export default function MetaHead({ title, description }: Props): ReactElement {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
    </Head>
  );
}
