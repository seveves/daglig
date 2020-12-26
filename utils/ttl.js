export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function ttlExpired(daglig, now) {
  now = now != null ? UTCDate(now) : UTCDate(new Date());

  const c = daglig.createdAt;
  let startOfCreated = UTCDate(c);
  let extraMs = 0;
  if (daglig.posts?.length > 0) {
    const latestPost = daglig.posts[daglig.posts.length - 1];
    startOfCreated = UTCDate(latestPost.createdAt);
    startOfCreated.setDate(startOfCreated.getDate() + 1);
    const likesAmount = latestPost.likes?.length;
    if (likesAmount > 0) {
      extraMs = likesAmount * 60 * 1000;
    }
  }
  startOfCreated.setHours(0, 0, 0, 0);
  const startOfNextDay = UTCDate(startOfCreated);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);
  const ttl = startOfNextDay.getTime() + extraMs - now.getTime();
  const expired = ttl <= 0;
  return { expired, ttl: !expired ? ttl : 0 };
}

export function ttlGrayscale(ttl) {
  const left = Math.round(((ONE_DAY_IN_MS - ttl) / ONE_DAY_IN_MS) * 100);
  const leftNorm = left < 0 ? 0 : left > 100 ? 100 : 0;
  const grayscale = {
    WebkitFilter: `grayscale(${leftNorm}%)`,
    filter: `grayscale(${leftNorm}%)`,
  };
  return grayscale;
}

export function UTCDate(c) {
  return new Date(
    Date.UTC(
      c.getUTCFullYear(),
      c.getUTCMonth(),
      c.getUTCDate(),
      c.getUTCHours(),
      c.getUTCMinutes(),
      c.getUTCSeconds(),
      c.getUTCMilliseconds()
    )
  );
}
