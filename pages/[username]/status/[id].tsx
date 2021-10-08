import { GetStaticPaths } from "next";
import { getSinglePost, getUserInfoByUsername } from '../../../src/helpers/queries';
import Layout from '../../../src/layouts/Layout';
import Post from '../../../src/components/user/Post';

const UserSinglePostPage: FunctionComponent = (props) => {
  return (
    <Layout>
      <Post user={props.user} post={props.post} />
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
  const user = await getUserInfoByUsername(params.username);
  let data = {};

  user.forEach(child => data['user'] = child.val());
  doc.forEach(d => data['post'] = d.data());

  if (!data || !data['post']) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...data },
  }
}

export default UserSinglePostPage;
