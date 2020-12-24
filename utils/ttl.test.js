import { ttlExpired } from './ttl';

describe('ttlExpired', () => {
  test('same time - use createdAt when posts are null', () => {
    const now = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt: now,
      posts: null,
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(false);
    expect(ttl > 0).toBe(true);
  });

  test('10h old - use createdAt when posts are null', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setHours(createdAt.getHours() - 10);
    const daglig = {
      createdAt,
      posts: null,
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(false);
    expect(ttl).toBe(14 * 60 * 60 * 1000);
  });

  test('12h old - use createdAt when posts are null', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setHours(createdAt.getHours() - 12);
    const daglig = {
      createdAt,
      posts: null,
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('1d old - use createdAt when posts are null', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - 1);
    const daglig = {
      createdAt,
      posts: null,
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('2d old - use createdAt when posts are null', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - 2);
    const daglig = {
      createdAt,
      posts: null,
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('same time - use createdAt of oldest post', () => {
    const now = new Date(1987, 10, 1, 10);
    const daglig = {
      createdAt: now,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt: now, likes: [] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(false);
    expect(ttl > 0).toBe(true);
  });

  test('10h old - use createdAt of oldest post', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setHours(createdAt.getHours() - 10);
    const daglig = {
      createdAt,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt, likes: [] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(false);
    expect(ttl).toBe(14 * 60 * 60 * 1000);
  });

  test('12h old - use createdAt of oldest post', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setHours(createdAt.getHours() - 12);
    const daglig = {
      createdAt,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt, likes: [] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('1d old - use createdAt of oldest post', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - 1);
    const daglig = {
      createdAt,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt, likes: [] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('2d old - use createdAt of oldest post', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - 2);
    const daglig = {
      createdAt,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt, likes: [] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(true);
    expect(ttl).toBe(0);
  });

  test('3 extra minutes because of 3 likes', () => {
    const now = new Date(1987, 10, 1, 10);
    const createdAt = new Date(now);
    const daglig = {
      createdAt,
      posts: [
        { createdAt: new Date(1987, 10, 1, 9), likes: [] },
        { createdAt, likes: ['foo', 'bar', 'baz'] },
      ],
    };
    const { expired, ttl } = ttlExpired(now, daglig);
    expect(expired).toBe(false);
    expect(ttl).toBe(50580000); // 14h and 3min
  });
});
