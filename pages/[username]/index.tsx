import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from 'querystring'
import Layout from '../../src/layouts/Layout'
import UserFeed from '../../src/components/user/UserFeed';
import { getUserInfoByUsername, getUserFollowers, getUserFollowing } from "../../src/helpers/queries";

type Props = {
  data: {}
}

interface IParams extends ParsedUrlQuery {
  username: string
}

const UserPage: FunctionComponent<Props> = ({ data }) => {
  return (
    <Layout >
      <UserFeed user={data} />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};


export const getStaticProps: GetStaticProps = async (context) => {
  const { username } = context.params as IParams
  let data: {} = {};
  let uid: String | null = '';
  const Userquery = await getUserInfoByUsername(username);

  Userquery.forEach((child: firebase.database.DataSnapshot) => {
    uid = child.key;
    data = child.val();

    return false;
  });

  if (!Object.keys(data).length) {
    return {
      notFound: true,
    }
  }

  const followers = uid ? await getUserFollowers(uid) : { size: 0 };
  const following = uid ? await getUserFollowing(uid) : { size: 0 };

  return {
    props: { data: { ...data, uid, followers: followers.size, following: following.size } },
  }
}

export default UserPage;
