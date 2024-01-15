import React, { useState, useEffect } from 'react';
import '../Styles/Posts.css'; // You can create a separate CSS file for styling
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Post = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [category, setCategory] = useState('Organic Farming');
  const [language, setLanguage] = useState('English');
  const [session, setSession] = useState(null)

  const [selectedFontColor, setSelectedFontColor] = useState('black');
  const [lineSpacing, setLineSpacing] = useState('1.5'); // Default line spacing is 1.5
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    navigate('/');
  }
  else {
    
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.innerText);
  };

  const handleBoldClick = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalicClick = () => {
    document.execCommand('italic', false, null);
  };

  const handleUnderlineClick = () => {
    document.execCommand('underline', false, null);
  };

  const handleFontColor = (color) => {
    document.execCommand('foreColor', false, color);
    setSelectedFontColor(color);
  };

  const handleBackgroundColor = (color) => {
    document.execCommand('hiliteColor', false, color);
  };

  const handleFontSize = (size) => {
    document.execCommand('fontSize', false, size);
  };

  const handleTableClick = () => {
    const numRows = prompt('Enter number of rows:');
    const numCols = prompt('Enter number of columns:');
    const alignment = prompt('Enter table alignment (left, center, right):');

    if (numRows && numCols) {
      const tableHTML = `<table border="1" align="${alignment}">
        ${Array.from({ length: numRows }, () => `
          <tr>
            ${Array.from({ length: numCols }, () => '<td>Cell</td>').join('')}
          </tr>
        `).join('')}
      </table>`;

      document.execCommand('insertHTML', false, tableHTML);
    }
  };

  const handleDottedPointsClick = () => {
    document.execCommand('insertUnorderedList', false, 'dotted-list');
  };

  const handleNumberedPointsClick = () => {
    document.execCommand('insertOrderedList', false, 'numbered-list');
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    handleFontColor(color);
  };

  const handleLineSpacingChange = (e) => {
    setLineSpacing(e.target.value);
    document.execCommand('defaultParagraphSeparator', false, 'div');
    document.execCommand('styleWithCSS', false, true);
    // document.execCommand('fontSize', false, '1');
    document.execCommand('lineHeight', false, e.target.value);
  };
 const handleAdminPageNavigation = () => {
    navigate('/admin'); // Navigate to the '/admin' page
  };
  const handlePublish = () => {
    const fullContent = `${title}\n${description}\n\n${content}`;
    setHtmlContent(fullContent);
  };

  return (
    <div className="post-container">
     <div className="header">
        <button onClick={handleAdminPageNavigation} className="admin-button">
          Go Back
        </button>
        <h1>Create a New Blog Post</h1>
        <div className="top-right">
          <button onClick={handlePublish} className="publish-button">
            <i className="fas fa-cloud-upload-alt"></i> Publish
          </button>
        </div>
      </div>
      <div className="category-container">
        <label htmlFor="language">Select Language</label>
        <select
          id="language"
          className="category-dropdown"  // You can keep the same style for both dropdowns
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
          <option value="Tamil">Tamil</option>
        </select>
      </div>

      <div className="category-container">
        <label htmlFor="category">Select Category</label>
        <select
          id="category"
          className="category-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Organic Farming">Organic Farming</option>
          <option value="Animal husbandry">Animal husbandry</option>
          <option value="Nourishment garden">Nourishment garden</option>
          <option value="Food processing">Food processing</option>
        </select>
      </div>

      <div className="post-details">
        <label>
          <i className="fas fa-heading"></i> Title:
          <input type="text" value={title} onChange={handleTitleChange} style={{ width: '99%', height: '30px' }} />
        </label>
        <label>
          <i className="fas fa-align-left"></i> Description:
          <textarea value={description} onChange={handleDescriptionChange} style={{ width: '99%', height: '80px', resize: 'none'}} />
        </label>
      </div>

      <div className="text-styling-options">
        <label>
          <i className="fas fa-paint-brush"></i> Font Color:
          <input type="color" value={selectedFontColor} onChange={handleColorChange} ></input>
          <div className="color-indicator" style={{ backgroundColor: selectedFontColor }}></div>
        </label>
        <button onClick={() => handleBackgroundColor('yellow')}>
          <i className="fas fa-paint-roller"></i> Background Color
        </button>
        <label>
          <i className="fas fa-text-height"></i> Font Size:
          <input
            type="number"
            min="1"
            max="100"
            onChange={(e) => handleFontSize(e.target.value)}
          />
        </label>
        <label>
          <i className="fas fa-text-height"></i> Line Spacing:
          <select value={lineSpacing} onChange={handleLineSpacingChange}>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="2.5">2.5</option>
          </select>
        </label>
      </div>

      <div className="formatting-options">
        <button onClick={handleBoldClick}><i className="fas fa-bold"></i> Bold</button>
        <button onClick={handleItalicClick}><i className="fas fa-italic"></i> Italic</button>
        <button onClick={handleUnderlineClick}><i className="fas fa-underline"></i> Underline</button>
        <button onClick={handleTableClick}><i className="fas fa-table"></i> Insert Table</button>
        <button onClick={handleDottedPointsClick}><i className="fas fa-list"></i> Dotted Points</button>
        <button onClick={handleNumberedPointsClick}><i className="fas fa-list-ol"></i> Numbered Points</button>
      </div>

      <div className="post-textarea-container">
        <div
          contentEditable
          className="post-textarea"
          onInput={handleContentChange}
          style={{ lineHeight: `${lineSpacing}em` }}
        ></div>
      </div>
    </div>
  );
};

export default Post;
