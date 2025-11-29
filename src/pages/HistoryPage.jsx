import React, { useState, useEffect } from 'react';
import { fetchBills, clearAllBills } from '../services/BillService';
import { FaDownload, FaTrash } from 'react-icons/fa';

const HistoryPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        try {
            const data = await fetchBills();
            setBills(data);
        } catch (error) {
            console.error("Failed to load bills", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (bills.length === 0) {
            alert("No bills to export.");
            return;
        }

        const headers = ["Bill ID", "Date", "Items", "Total"];
        const rows = bills.map(bill => {
            const itemsStr = bill.items.map(i => `${i.productName} (${i.quantity})`).join("; ");
            return [
                bill.id,
                bill.createdAt.toLocaleString(),
                `"${itemsStr}"`, // Quote to handle commas in items
                bill.grandTotal.toFixed(2)
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `bills_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleClearHistory = async () => {
        if (window.confirm("Are you sure you want to DELETE ALL BILL HISTORY? This cannot be undone.")) {
            try {
                await clearAllBills();
                alert("History cleared successfully.");
                loadBills();
                setSelectedBill(null);
            } catch (error) {
                alert("Failed to clear history: " + error.message);
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Bill History</h2>
                <div>
                    <button className="btn btn-success me-2" onClick={handleExportCSV} disabled={bills.length === 0}>
                        <FaDownload className="me-1" /> Export CSV
                    </button>
                    <button className="btn btn-danger" onClick={handleClearHistory} disabled={bills.length === 0}>
                        <FaTrash className="me-1" /> Clear History
                    </button>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="row">
                    <div className="col-md-4">
                        <div className="list-group">
                            {bills.map(bill => (
                                <button
                                    key={bill.id}
                                    className={`list-group-item list-group-item-action ${selectedBill?.id === bill.id ? 'active' : ''}`}
                                    onClick={() => setSelectedBill(bill)}
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">Bill #{bill.id.slice(0, 6)}</h5>
                                        <small>{bill.createdAt.toLocaleDateString()}</small>
                                    </div>
                                    <p className="mb-1">Total: ₹{bill.grandTotal.toFixed(2)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-8">
                        {selectedBill ? (
                            <div className="card">
                                <div className="card-header">
                                    Bill Details - {selectedBill.id}
                                </div>
                                <div className="card-body">
                                    <p><strong>Date:</strong> {selectedBill.createdAt.toLocaleString()}</p>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedBill.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.productName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>₹{item.price}</td>
                                                    <td>₹{item.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <h4 className="text-end">Grand Total: ₹{selectedBill.grandTotal.toFixed(2)}</h4>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info">Select a bill to view details</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
