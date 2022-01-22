import { ParsedUrlQuery } from 'querystring'
import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { getSinglePost, getUserInfoByUsername } from '../../../src/helpers/queries';
import Layout from '../../../src/layouts/Layout';
import Post from '../../../src/components/Posts/Post';
import AddComment from '../../../src/components/inputs/AddComment';
import Comments from '../../../src/components/comments/Comments';

import { singlePostType } from "../../../src/helpers/types";

type Props = {
  user: firebase.User,
  post: singlePostType
}

interface IParams extends ParsedUrlQuery {
  id: string,
  username: string
}

const UserSinglePostPage: FunctionComponent<Props> = (props) => {
  return (
    <Layout>
      <div className="md:w-3/4 md:mx-auto md:mt-2">
        <Post user={props.user} post={props.post} />
        <AddComment postID={props.post.postID} />
        <Comments postID={props.post.postID} />
      </div>
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
  const { id, username } = context.params as IParams

  const doc = await getSinglePost(id);
  const user = await getUserInfoByUsername(username);
  const data = {
    user: {},
    post: {}
  };

  user.forEach(child => data['user'] = child.val());
  doc.forEach(d => data['post'] = d.data());

  if (!Object.keys(!data['post']).length) {
    return {
      notFound: true,
    }
  }

  return {
    props: { ...data },
  }
}

export default UserSinglePostPage;
