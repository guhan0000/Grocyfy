import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/ProductService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const OwnerPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        price: '',
        stock: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productName || !formData.price) return;

        const productData = {
            productName: formData.productName,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                alert("Product updated successfully!");
            } else {
                await addProduct(productData);
                alert("Product added successfully!");
            }
            setFormData({ productName: '', category: '', price: '', stock: '' });
            setEditingProduct(null);
            loadProducts();
        } catch (error) {
            alert("Operation failed: " + error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName,
            category: product.category || '',
            price: product.price,
            stock: product.stock || 0
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (error) {
                alert("Delete failed: " + error.message);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({ productName: '', category: '', price: '', stock: '' });
    };

    const handleClearLocalStorage = () => {
        if (window.confirm("Are you sure you want to clear the locally stored bill data? This will empty the current bill on the Billing page.")) {
            localStorage.removeItem('cartItems');
            alert("Local bill data cleared!");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Owner Dashboard - Product Management</h2>
                <button className="btn btn-warning" onClick={handleClearLocalStorage}>Clear Local Bill Data</button>
            </div>

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Stock</label>
                            <input
                                type="number"
                                className="form-control"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                            <button type="submit" className="btn btn-success w-100">
                                {editingProduct ? 'Update' : <FaPlus />}
                            </button>
                        </div>
                        {editingProduct && (
                            <div className="col-12 text-end">
                                <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel Edit</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No products found.</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.productName}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.stock || 0}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(product)}><FaEdit /></button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerPage;
