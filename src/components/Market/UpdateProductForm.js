// UpdateProductForm.jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UpdateProductForm = ({ productId, onClose, fetchProductData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Add other fields as needed
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', productId);

        if (error) {
          console.error('Error fetching product details:', error);
        } else {
          setFormData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', productId);

      if (error) {
        console.error('Error updating product:', error);
      } else {
        fetchProductData();
        onClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="modal-container">
    <div className="delete-modal">
      <h3>Edit Product</h3>
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

        <button type="submit">Update Product</button>
      </form>
    </div>
    </div>
  );
};

export default UpdateProductForm;
