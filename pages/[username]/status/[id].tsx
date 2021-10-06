import { GetStaticPaths } from "next";
import { getSinglePost, getUserInfo } from '../../../src/helpers/queries';
import Layout from '../../../src/layouts/Layout';
import Post from '../../../src/components/user/Post';

const UserSinglePostPage: FunctionComponent = ({ user, post }) => {

  return (
    <Layout>
      <Post user={user} post={post} />
    </Layout>
  )

}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};


export async function getStaticProps({ params }) {
  const doc = await getSinglePost(params.id);
  const user = await getUserInfo(params.username);
  let data = {};

  user.forEach(child => data['user'] = child.val());
  doc.forEach(d => data['post'] = d.data());

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...data },
  }
}

export default UserSinglePostPage;
