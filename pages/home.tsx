import Feed from '../src/components/feed/Feed';
import Layout from '..//src/layouts/Layout'
import { PostProvider } from '../src/context/postContext';

const FeedPage: FunctionComponent = () => {

  return (
    <PostProvider>
      <Layout>
        <Feed />
      </Layout>
    </PostProvider>
  )

}

export default FeedPage;
