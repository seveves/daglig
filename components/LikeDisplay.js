import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/like-display.module.css';
import { fetchPostJSON } from '../utils/fetch';

const LikeDisplay = ({ likes, owner, postId, dagligId, userId }) => {
  const [amount, setAmount] = useState(likes != null ? likes.length : 0);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(
    likes != null ? likes.indexOf(userId) !== -1 : false
  );

  const likePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchPostJSON('/api/like-post', {
      dagligId,
      postId,
      userId,
    });
    if (res.statusCode === 201) {
      setAmount(res.likes.length);
      setLiking(res.likes.indexOf(userId) !== -1);
    }
    setLoading(false);
  };

  return (
    <div className={styles.likedisplay}>
      {owner || (!dagligId && !userId) ? (
        <div className={styles.iconbtn}>
          <Image
            src="/suit-heart.svg"
            alt="like"
            width="16"
            height="16"
            title={`${amount} likes`}
          />
          <span>{amount}</span>
        </div>
      ) : (
        <button className={styles.iconbtn} onClick={likePost} disabled={loading}>
          <Image
            src={liking ? '/suit-heart-fill.svg' : '/suit-heart.svg'}
            alt="like"
            width="16"
            height="16"
            title={`${amount} likes`}
          />
          <span>{amount}</span>
        </button>
      )}
    </div>
  );
};

export default LikeDisplay;
