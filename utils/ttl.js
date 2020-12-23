
export function ttlExpired(now, daglig) {
  let startOfCreated = new Date(daglig.createdAt);
  let extraMs = 0;
  if (daglig.posts?.length > 0) {
    const latestPost = daglig.posts[daglig.posts.length - 1];
    startOfCreated = new Date(latestPost.createdAt);
    const likesAmount = latestPost.likes?.length;
    if (likesAmount > 0) {
      extraMs = likesAmount * 60 * 1000;
    }
  }
  startOfCreated.setHours(0, 0, 0, 0);
  const startOfNextDay = new Date(startOfCreated);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);
  const ttl = (startOfNextDay.getTime() + extraMs) - now.getTime();
  const expired = ttl <= 0;
  return { expired, ttl: !expired ? ttl : 0 };
}
