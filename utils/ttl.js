export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function ttlExpired(posts, createdAt) {
  const now = Date.now();
  let ttl = ONE_DAY_IN_MS - (now - createdAt.getTime());
  if (posts?.length > 0) {
    const latest = posts[posts.length - 1];
    const latestTime = latest.createdAt.getTime();
    const likesExtraMinutes =
      latest.likes?.length > 0 ? latest.likes.length * 60 * 1000 : 0;
    ttl = ONE_DAY_IN_MS - (now - latestTime) + likesExtraMinutes;
  }
  const expired = ttl > ONE_DAY_IN_MS;
  return { ttl, expired };
}
