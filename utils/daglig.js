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
    createdAt: daglig.createdAt.getTime(),
  };
}

export function dagligBack(session, daglig) {
  return session
    ? session.user.id !== daglig.userid
      ? session.user.name || false
      : false
    : false;
}
