import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';
import { getSellerProducts, addProduct, updateProduct, deleteProduct } from '../../services/sellerProducts';
import '../../assets/styles/product-management.css';

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  countInStock: number;
  image: string;
  rating?: number;
  numReviews?: number;
  isNew?: boolean;
}

const initialProductState = {
  name: '',
  brand: '',
  price: 0,
  description: '',
  category: 'Dogs',
  countInStock: 0,
  image: '',
  isNew: true
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialProductState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/seller-login');
      return;
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getSellerProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [navigate, refreshTrigger]);
  
  const handleBackToDashboard = () => {
    navigate('/seller-dashboard');
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setImageFile(fileInput.files[0]);
      }
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Modal handlers
  const openAddModal = () => {
    setFormData(initialProductState);
    setImageFile(null);
    setShowAddModal(true);
  };
  
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description,
      category: product.category,
      countInStock: product.countInStock,
      image: product.image,
      isNew: product.isNew || false
    });
    setImageFile(null);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };
  
  // Form submission handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create product data with image file
      const productData = {
        ...formData,
        image: imageFile || 'placeholder.jpg' // Use a placeholder if no image uploaded
      };
      
      await addProduct(productData);
      setShowAddModal(false);
      setSuccessMessage('Product added successfully!');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    try {
      setLoading(true);
      
      // Create product data with optional image file
      const productData = {
        ...formData,
        image: imageFile || formData.image
      };
      
      await updateProduct(currentProduct._id, productData);
      setShowEditModal(false);
      setSuccessMessage('Product updated successfully!');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    try {
      setLoading(true);
      await deleteProduct(currentProduct._id);
      setShowDeleteModal(false);
      setSuccessMessage('Product deleted successfully!');
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset success/error messages when modals are closed
  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };
  
  // Function to ensure image URL is valid
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder.jpg';
    
    // If the URL is already absolute (starts with http or https), use it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If the URL starts with /api/uploads, prepend the backend URL
    if (imageUrl.startsWith('/api/uploads')) {
      return `http://localhost:5001${imageUrl}`;
    }
    
    // If it's another relative path, return as is
    return imageUrl;
  };
  
  return (
    <Container className="py-5 product-management">
      <Row className="mb-4">
        <Col>
          <div className="management-header d-flex justify-content-between align-items-center">
            <h2>Product Management</h2>
            <Button variant="outline-secondary" onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
        </Col>
      </Row>
      
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={openAddModal}>
            <i className="bi bi-plus-circle me-2"></i>Add New Product
          </Button>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Your Products</Card.Title>
              
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : products.length === 0 ? (
                <Alert variant="info">
                  You haven't added any products yet. Click "Add New Product" to get started.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product._id}>
                          <td>
                            <div className="thumbnail-container">
                              <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name} 
                                className="product-thumbnail" 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.jpg';
                                  console.log('Image failed to load:', product.image);
                                }}
                              />
                            </div>
                          </td>
                          <td>{product.name}</td>
                          <td>{product.brand}</td>
                          <td>{product.category}</td>
                          <td>PKR {product.price.toFixed(2)}</td>
                          <td>{product.countInStock}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => openEditModal(product)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => openDeleteModal(product)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); resetMessages(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddProduct}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand *</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (PKR) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="0"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Birds">Birds</option>
                <option value="Fish">Fish</option>
                <option value="Small Pets">Small Pets</option>
                <option value="Reptiles">Reptiles</option>
                <option value="Accessories">Accessories</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Upload a product image. Recommended size: 500x500px.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as New Product"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowAddModal(false); resetMessages(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); resetMessages(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProduct}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand *</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    step="1"
                    min="0"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Birds">Birds</option>
                <option value="Fish">Fish</option>
                <option value="Small Pets">Small Pets</option>
                <option value="Reptiles">Reptiles</option>
                <option value="Accessories">Accessories</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              {formData.image && !imageFile && (
                <div className="mb-2 image-preview-container">
                  <img 
                    src={getImageUrl(formData.image)} 
                    alt="Product" 
                    className="img-thumbnail product-preview" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                      console.log('Image failed to load:', formData.image);
                    }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <Form.Text className="text-muted">
                Upload a new image or keep the existing one.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as New Product"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowEditModal(false); resetMessages(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); resetMessages(); }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Are you sure you want to delete <strong>{currentProduct?.name}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteModal(false); resetMessages(); }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductManagement; 