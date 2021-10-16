import { GetStaticPaths } from "next";
import { getSinglePost, getUserInfoByUsername } from '../../../src/helpers/queries';
import Layout from '../../../src/layouts/Layout';
import Post from '../../../src/components/user/Post';
import AddComment from '../../../src/components/inputs/AddComment';
import Comments from '../../../src/components/comments/Comments';

const UserSinglePostPage: FunctionComponent = (props) => {
  return (
    <Layout>
      <div className="md:w-3/4 md:mx-auto md:mt-2">
        <Post user={props.user} post={props.post} />
        <AddComment postID={props.post.postID} />
        <Comments postID={props.post.postID}/>
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
