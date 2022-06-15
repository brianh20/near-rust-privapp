
import './style.css';
import React, { useState } from 'react';

const NewSecret = ({ postSecret }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const handlers = {
    title: setTitle,
    content: setContent,
    price: setPrice
  };
  const [error, setError] = useState('');

  const addSecret = async () => {
    const nearPrice = Math.round(price * 100000);
    if (title && content && nearPrice && !isNaN(nearPrice)) {
      setError("");
      postSecret({ title, content, price: nearPrice })
    } else {
      setError("At least one of the fields is incorrect");
    }
  }

  const handleChange = (e) => {
    handlers[e.target.name](e.target.value);
  }

  return (
    <div id="new-secret">
      <div className="field"><span>Title:</span><input type="text" name="title" onChange={handleChange} /></div>
      <div className="field"><span>Content:</span><input type="text" name="content" onChange={handleChange} /></div>
      <div className="field"><span>Price (N):</span><input type="number" min="0" step="0.00001" name="price" onChange={handleChange} /></div>
      <div id="submit">
        <div>
          <span className="important">{error}</span>
        </div>
        <button onClick={addSecret}>Add Secret</button>
      </div>
    </div>
  );
}

export default NewSecret;
