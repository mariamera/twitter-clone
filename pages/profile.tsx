import Profile from '../src/components/Profile/Profile';
import Layout from '../src/layouts/Layout';
import { PostProvider } from '../src/context/postContext';

const Home: FunctionComponent = () => {

  return (
    <PostProvider>
      <Layout>
        <Profile />
      </Layout>
    </PostProvider>
  )

}

export default Home;
