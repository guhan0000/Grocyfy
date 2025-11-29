import React from 'react';
import { FaTrash } from 'react-icons/fa';

const BillTable = ({ items, onRemoveItem }) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No items added yet.</td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.productName}</td>
                                <td>₹{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.total}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onRemoveItem(index)}
                                        title="Remove Item"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BillTable;
