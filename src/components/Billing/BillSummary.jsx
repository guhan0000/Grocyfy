import React from 'react';

const BillSummary = ({ items }) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = subtotal; // No tax calculation as per requirements

    return (
        <div className="card">
            <div className="card-header bg-secondary text-white">Bill Summary</div>
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-4 fw-bold text-success">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default BillSummary;
