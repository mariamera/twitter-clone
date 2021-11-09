import { FunctionComponent } from "react";
import { ParsedUrlQuery } from 'querystring'
import { GetStaticPaths, GetStaticProps } from "next";
import { getSinglePost, getUserInfoByUsername } from '../../../src/helpers/queries';
import Layout from '../../../src/layouts/Layout';
import Post from '../../../src/components/Posts/Post';
import AddComment from '../../../src/components/inputs/AddComment';
import Comments from '../../../src/components/comments/Comments';

type Props = {
  user: {},
  post: {
    postID: string
  }
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
  let data = {
    user: {},
    post: {}
  };

  console.log("user: ", user);
  user.forEach(child => data['user'] = child.val());
  doc.forEach(d => data['post'] = d.data());

  console.log("data['user']: ", data['user']);

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
