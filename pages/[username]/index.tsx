import { GetStaticPaths } from "next";
import Menu from '../../src/components/Menu';
import UserFeed from '../../src/components/user/UserFeed';
import { getUserInfo, getUserFollowers } from '../../src/helpers/queries';

const UserPage: FunctionComponent = (props) => {

  return (
    <div className="w-full">
      <Menu />
      <UserFeed user={props.data} />
    </div>
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
  const Userquery = await getUserInfo(params.username);

  Userquery.forEach(async (child) => {
    data = child.val();
  });

  if (!data) {
    return {
      notFound: true,
    }
  }

  const followers = await getUserFollowers(data.username);

  return {
    props: { data: { ...data, followers: followers.size }}, // will be passed to the page component as props
  }
}

export default UserPage;
