import Link from 'next/link';
import insane from 'insane';
import marked from 'marked';
import prettyms from 'pretty-ms';

import LikeDisplay from './LikeDisplay';

import { ttlGrayscale } from '../utils/ttl';

import styles from '../styles/post-list-item.module.css';

const PostListItem = ({ post, owner, userId, dagligId }) => {
  const prettycreated = (t) => prettyms(Date.now() - t, { compact: true });
  return (
    <li className={styles.postlistitem}>
      {post.user != null && (
        <div className={styles.user}>
          <Link href={`/${post.user.username}`}>
            <a>
              <img
                style={ttlGrayscale(post.user.ttlExpired.ttl)}
                src={post.user.image}
                alt="Profile Image"
              />
              <h2>{post.user.username}</h2>
            </a>
          </Link>
        </div>
      )}
      <article
        className={styles.message}
        dangerouslySetInnerHTML={{
          __html: insane(marked(post.message, { gfm: true }), {
            allowedTags: ['h1', 'p', 'u', 'em', 'strong', 'code', 'pre'],
          }),
        }}
      ></article>
      <div className={styles.messageactions}>
        <div>about {prettycreated(post.createdAt)} ago</div>
        <div className={styles.likes}>
          <LikeDisplay
            likes={post.likes}
            owner={owner}
            postId={post.id}
            dagligId={dagligId}
            userId={userId}
          />
        </div>
      </div>
    </li>
  );
};

export default PostListItem;
