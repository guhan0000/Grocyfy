import React, { useState, useEffect } from 'react';

const ProductSelector = ({ products, onAddItem }) => {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!selectedProductId || quantity <= 0) return;

        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            onAddItem(product, parseInt(quantity));
            setSelectedProductId('');
            setQuantity(1);
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-header bg-primary text-white">Add Item</div>
            <div className="card-body">
                <form onSubmit={handleAdd} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Product</label>
                        <select
                            className="form-select"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            required
                        >
                            <option value="">Select Product...</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.productName} - ₹{product.price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button type="submit" className="btn btn-success w-100">Add to Bill</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductSelector;
