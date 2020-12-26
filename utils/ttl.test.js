import { ONE_DAY_IN_MS, ttlExpired, UTCDate } from './ttl';

describe('ttlExpired', () => {
  test('just created profile', () => {
    const now = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt: now,
      posts: [],
    };
    const { expired, ttl } = ttlExpired(daglig, now);
    expect(expired).toBe(false);
    expect(ttl).toBe(14 * 60 * 60 * 1000); // 14h left of the current day
  });

  test('created profile but wrote no post till next day', () => {
    const createdAt = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt,
      posts: [],
    };
    const { expired, ttl } = ttlExpired(daglig, new Date(1987, 10, 2));
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('created profile but wrote no post till the end of current day', () => {
    const createdAt = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt,
      posts: [],
    };
    const { expired, ttl } = ttlExpired(daglig, new Date(1987, 10, 1, 23, 59, 59, 999));
    expect(expired).toBe(false);
    expect(ttl).toBe(1);
  });

  test('just created profile and directly wrote first post', () => {
    const createdAt = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt,
      posts: [{
        createdAt,
        likes: []
      }],
    };
    const { expired, ttl } = ttlExpired(daglig, createdAt);
    expect(expired).toBe(false);
    expect(ttl).toBe(14 * 60 * 60 * 1000 + ONE_DAY_IN_MS);
  });

  test('wrote post yesterday', () => {
    const daglig = {
      createdAt: new Date(1987, 10, 1),
      posts: [{
        createdAt: new Date(1987, 10, 2),
        likes: []
      }],
    };
    const { expired, ttl } = ttlExpired(daglig, new Date(1987, 10, 3));
    expect(expired).toBe(false);
    expect(ttl).toBe(ONE_DAY_IN_MS);
  });

  test('wrote post yesterday and very close to be deleted', () => {
    const daglig = {
      createdAt: new Date(1987, 10, 1),
      posts: [{
        createdAt: new Date(1987, 10, 2),
        likes: []
      }],
    };
    const { expired, ttl } = ttlExpired(daglig, new Date(1987, 10, 3, 23, 59, 59, 999));
    expect(expired).toBe(false);
    expect(ttl).toBe(1);
  });

  test('wrote post two days before', () => {
    const daglig = {
      createdAt: new Date(1987, 10, 1),
      posts: [{
        createdAt: new Date(1987, 10, 2),
        likes: []
      }],
    };
    const { expired, ttl } = ttlExpired(daglig, new Date(1987, 10, 4));
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });
});
