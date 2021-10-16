import { GetStaticPaths } from "next";
import Layout from '../../src/layouts/Layout'
import UserFeed from '../../src/components/user/UserFeed';
import { getUserInfoByUsername, getUserFollowers, getUserFollowing } from '../../src/helpers/queries';

const UserPage: FunctionComponent = (props) => {
  return (
    <Layout >
      <UserFeed user={props.data} />
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
  let data;
  let uid;
  const Userquery = await getUserInfoByUsername(params.username);

  Userquery.forEach(async (child) => {
    uid = child.key;
    data = child.val();
  });

  if (!data) {
    return {
      notFound: true,
    }
  }

  const followers = uid ? await getUserFollowers(uid) : 0;
  const following = uid ? await getUserFollowing(uid) : 0;

  return {
    props: { data: { ...data, uid, followers: followers.size, following: following.size } },
  }
}

export default UserPage;
