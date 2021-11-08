import { FunctionComponent } from "react";
import Profile from '../src/components/Profile/Profile';
import Layout from '../src/layouts/Layout';

const Home: FunctionComponent = () => {

  return (
    <Layout>
      <Profile />
    </Layout>
  )

}

export default Home;
