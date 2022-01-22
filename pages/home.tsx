import { FunctionComponent } from "react";
import MetaHead from "../src/components/MetaHead";
import Feed from "../src/components/feed/Feed";
import Layout from "..//src/layouts/Layout";

const FeedPage: FunctionComponent = () => {
  return (
    <>
    <MetaHead title="Home" description="app home to check other people status" />
    <Layout>
      <Feed />
    </Layout>
    </>
  );
};

export default FeedPage;
