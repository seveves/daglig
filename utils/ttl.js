export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function ttlExpired(now, daglig) {
  let startOfCreated = new Date(daglig.createdAt);
  let extraMs = 0;
  if (daglig.posts?.length > 0) {
    const latestPost = daglig.posts[daglig.posts.length - 1];
    startOfCreated = new Date(latestPost.createdAt);
    if (
      now.getFullYear() === startOfCreated.getFullYear() &&
      now.getMonth() === startOfCreated.getMonth() &&
      now.getDate() === startOfCreated.getDate()
    ) {
      startOfCreated.setDate(startOfCreated.getDate() + 1);
      const likesAmount = latestPost.likes?.length;
      if (likesAmount > 0) {
        extraMs = likesAmount * 60 * 1000;
      }
    }
  }
  startOfCreated.setHours(0, 0, 0, 0);
  const startOfNextDay = new Date(startOfCreated);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);
  const ttl = startOfNextDay.getTime() + extraMs - now.getTime();
  const expired = ttl <= 0;
  return { expired, ttl: !expired ? ttl : 0 };
}
