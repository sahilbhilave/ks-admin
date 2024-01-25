import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CreateProductForm = ({ onClose, onProductEntryCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Add other fields as needed
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('products').insert([formData]);

      if (error) {
        console.error('Error creating product:', error);
      } else {
        onProductEntryCreated(data[0]);
        onClose();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="form-container">
      <h3>Create New Product</h3>
      <form onSubmit={handleFormSubmit}>
        {/* Render form fields here */}
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </label>
        {/* Add other fields as needed */}

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductForm;
