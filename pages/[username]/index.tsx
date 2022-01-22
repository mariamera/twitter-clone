import { ParsedUrlQuery } from 'querystring'
import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from '../../src/layouts/Layout'
import MetaHead from '../../src/components/MetaHead'
import UserFeed from '../../src/components/user/UserFeed';
import { getUserInfoByUsername, getUserFollowers, getUserFollowing } from "../../src/helpers/queries";

import { UserType } from "../../src/helpers/types";

type Props = {
  data: UserType
}

interface IParams extends ParsedUrlQuery {
  username: string
}

const UserPage: FunctionComponent<Props> = ({ data }) => {
  const { username = ''} = data;

  return (
    <>
    <MetaHead title={`${username || ''}'s profile`} description={`${username || ''} profile`} />
    <Layout >
      <UserFeed user={data} />
    </Layout>
    </>
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
  let uid: string | null = '';
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
