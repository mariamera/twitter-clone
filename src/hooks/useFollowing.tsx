import { useState } from "react";
import { getUserFollowing, getUserInfoById } from '../helpers/queries';

export const useFollowing = (): [firebase.User[], (uid: string) => void] => {
  const [followersList, setFollowersList] = useState<firebase.User[]>([]);
  // const [currentIndex, setCurrentIndex] = useState(0);

  async function getFollowing(uid: string) {
    const following = await getUserFollowing(uid);
    const currentFollowerList = await following.docs.map(follow => follow.data());

    const cfl = await Promise.all(currentFollowerList.map(async data => {
      const followeeData = await getUserInfoById(data.followeeId as string);
      return followeeData.val();
    }));

    setFollowersList(cfl);
    return;
  }

  return [followersList, getFollowing];
}