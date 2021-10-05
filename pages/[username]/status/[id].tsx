import { GetStaticPaths } from "next";
import Menu from '../../src/components/Menu';
import UserFeed from '../../src/components/user/UserFeed';
import { getUserInfo, getUserFollowers, getUserFollowing } from '../../src/helpers/queries';

const UserSinglePostPage: FunctionComponent = () => {

  return (
    <div className="w-full">
    klk
    </div>
  )

}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};


// export async function getStaticProps({ params }) {
//   let data;
//   let uid; 
//   const Userquery = await getUserInfo(params.username);

//   Userquery.forEach(async (child) => {
//     uid = child.key;
//     data = child.val();
//   });

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   const followers = uid ? await getUserFollowers(uid) : 0;
//   const following = uid ? await getUserFollowing(uid) : 0;

//   return {
//     props: { data: { ...data, followers: followers.size, following: following.size } }, // will be passed to the page component as props
//   }
// }

export default UserSinglePostPage;
