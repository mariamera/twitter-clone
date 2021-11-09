export type singlePostType = {
  date: number
  parentId: string
  postID: string
  text: string
  uid: string
}

export type UserType = {
  displayName: string | null
  email: string | null
  photoURL: string | null
  username?: string | null
  uid?: string | null
  followers?: number
  following?: number
};

export type PostType = {
  post: singlePostType,
  user: UserType
};
