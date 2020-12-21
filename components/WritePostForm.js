import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPostJSON } from '../utils/fetch';
import styles from '../styles/write-post.module.css';

const WritePostForm = ({ daglig }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const message = e.currentTarget.value;
    setMessage(message);
    setInvalid(message == null || message.length === 0 || message.length > 144);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchPostJSON('/api/write-post', {
      id: daglig.id,
      message: message,
    });
    if (res.statusCode === 400) {
      console.error(res.message);
      setInvalid(true);
      return;
    }
    if (res.statusCode === 404) {
      console.error(res.message);
      router.push('/');
      return;
    }
    setLoading(false);
    router.push(`/${daglig.username}`);
  };

  return (
    <div className={styles.writepost}>
      <p className="welcome">
        your post is limited to <b>144</b> characters but you are <u>allowed</u> to use some <i>markdown & html</i> tags.
        <ul className={styles.info}>
          <li><span className={styles.headerstyle}>header</span> - <code>{'<h1>this day is wonderful</h1>'}</code> or <code># this day is wonderful</code></li>
          <li><strong>bold text</strong> - <code>{'<strong>bold</strong>'}</code> or <code>**bold**</code> or <code>__bold__</code></li>
          <li><em>italic text</em> - <code>{'<em>italic</em>'}</code> or <code>*italic*</code> or <code>_italic_</code></li>
          <li><strong><em>bold and italic text</em></strong> - <code>{'<strong><em>strong & italic</em></strong>'}</code> or <code>***bold & italic***</code> or <code>bold & italic___</code></li>
          <li><u>underlined text</u> - <code>{'<u>underlined</u>'}</code></li>
          <li><code>inline code</code> - <code>{'<code>npm install vercel</code>'}</code> or <code>`npm install vercel`</code></li>
        </ul>
      </p>
      <form className={styles.writepostform} onSubmit={handleSubmit}>
        <textarea
          title="message"
          className={styles.message}
          name="message"
          value={message}
          required={true}
          maxLength={144}
          minLength={1}
          onChange={handleInputChange}
        ></textarea>
        <div className={styles.messagedetails}>
          <span>{message.length} / 144</span>
        </div>
        <button
          className={'linkbtn ' + styles.postbtn}
          type="submit"
          disabled={loading || invalid}
        >
          <span>post</span>
        </button>
      </form>
    </div>
  );
};

export default WritePostForm;
