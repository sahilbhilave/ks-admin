import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateProductForm from './CreateProductForm';
import UpdateProductForm from './UpdateProductForm';
import ImageGallery from './Gallery';
import '../Styles/Market.css';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);




const MarketProducts = () => {
  const [productData, setProductData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Error fetching product data:', error);
      } else {
        setProductData(data);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    setDeleteProductId(productId);
    setDeleteConfirmation(true);
  };

  const handleDeleteProductConfirmation = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteProductId);

      if (error) {
        console.error('Error deleting product:', error);
      } else {
        fetchProductData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleteConfirmation(false);
      setDeleteProductId(null);
    }
  };

  const handleCancelDeleteProduct = () => {
    setDeleteProductId(null);
    setDeleteConfirmation(false);
  };

  const handleCreateProductEntry = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const handleProductEntryCreated = (newEntry) => {
    setProductData([...productData, newEntry]);
    fetchProductData();
    setIsCreateFormOpen(false); // Close the create form after submission
  };

  const handleEdit = (productId) => {
    setSelectedProductId(productId);
    setIsUpdateFormOpen(true);
  };

  const handleUpdateProductEntry = () => {
    setIsUpdateFormOpen(true);
  };

  const handleUpdateCloseForm = () => {
    setIsUpdateFormOpen(false);
  };

  

  return (
    <div className="admin-container">
      <div className='admin-form'>
        <button onClick={handleCreateProductEntry}>Create New Product</button>
      </div>
      <h2>Product Entries ({productData.length})</h2>
      {loadingProducts && (
        <div>
          <div className="loading">
            Loading <div className="spinner"></div>
          </div>
        </div>
      )}

{productData.map((entry) => (
  <div key={entry.id} className="product-card">
    
    <div className="product-details">
      <h3>{entry.name}</h3>
      <div className="product-images">
            {/* Integrate the ImageGallery component */}
            <ImageGallery images={entry.images} />
          </div>
      <p><strong>Product Name :</strong> {entry.product}</p>
      <p><strong>Description:</strong> {entry.description}</p>
      <p><strong>Price:</strong> ${entry.price}</p>
      <p><strong>Sell or Rent:</strong> {entry.type}</p>
      <p><strong>Date:</strong> {entry.created_at}</p>
    </div>
    <div className="product-actions">
      <button
        className="delete-button"
        onClick={() => handleDeleteProduct(entry.id)}
      >
        {deleteConfirmation && deleteProductId === entry.id ? (
          <div>
            <div>Deleting Product</div>
          </div>
        ) : (
          <FontAwesomeIcon icon={faTrash} />
        )}
      </button>

      <button className="edit-button" onClick={() => handleEdit(entry.id)}>
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  </div>
))}

{isCreateFormOpen && (
  // Render your create form component here
  <CreateProductForm
    onClose={handleCloseCreateForm}
    onProductEntryCreated={handleProductEntryCreated}
  />
)}

{isUpdateFormOpen && (
  // Render your update form component here
  <UpdateProductForm
    productId={selectedProductId}
    onClose={handleUpdateCloseForm}
    fetchProductData={fetchProductData}
  />
)}

      {deleteConfirmation && (
        <div className="modal-container">
          <div className="delete-modal">
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-buttons">
              <button className="yes-button" onClick={handleDeleteProductConfirmation}>
                Yes
              </button>
              <button className="cancel-button" onClick={handleCancelDeleteProduct}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketProducts;
