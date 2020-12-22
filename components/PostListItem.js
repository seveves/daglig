import insane from 'insane';
import marked from 'marked';
import prettyms from 'pretty-ms';

import LikeDisplay from './LikeDisplay';

import styles from '../styles/post-list-item.module.css';

const PostListItem = ({ post, owner, userId, daglig }) => {
  const prettycreated = (t) => prettyms(Date.now() - t, { compact: true });
  return (
    <li className={styles.postlistitem}>
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
            dagligId={daglig.id}
            userId={userId}
          />
        </div>
      </div>
    </li>
  );
};

export default PostListItem;
