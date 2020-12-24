export function dagligProps(daglig) {
  return {
    id: `${daglig._id}`,
    username: daglig.username,
    userid: daglig.userid,
    image: daglig.image,
    posts: daglig.posts
      .map((p) => ({
        id: `${p._id}`,
        createdAt: p.createdAt.getTime(),
        message: p.message,
        likes: p.likes.map((l) => `${l}`),
      }))
      .reverse(),
    favorites: daglig.favorites.map((f) => ({
      id: `${f._id}`,
      dagligId: f.dagligId,
      dagligUserName: f.dagligUserName,
    })),
    createdAt: daglig.createdAt.getTime(),
  };
}