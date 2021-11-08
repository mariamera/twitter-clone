import { FunctionComponent } from "react";
import Feed from '../src/components/feed/Feed';
import Layout from '..//src/layouts/Layout'

const FeedPage: FunctionComponent = () => {

  return (
    <Layout>
      <Feed />
    </Layout>
  )

}

export default FeedPage;
