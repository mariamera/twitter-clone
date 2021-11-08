import React, {useState} from "react";
import { getUserFollowing , getUserInfoById} from '../helpers/queries';

export default function useFollowings() {
  const [followersList, setFollowersList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  async function getFollowing(uid) {
   const following = await getUserFollowing(uid);
   const currentFollowerList = await following.docs.map(follow => follow.data());
   const cfl = await Promise.all(currentFollowerList.map(async data => {
    const followeeData = await getUserInfoById(data.followeeId);
    return followeeData.val();
   }));

  //  const currentFollowerList = await following.docs.map(async followUser => {
  //    const { followeeId }=  followUser.data(); 
  //   const followeeData = await getUserInfoById(followeeId);
  //   console.log("followeeData.val(): ", followeeData.val());
  //   return followeeData.val();
  //  })

  console.log("cfl: ", cfl);
   setFollowersList(cfl)
  }

  return [ followersList, getFollowing ];

}