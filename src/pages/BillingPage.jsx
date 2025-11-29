import React, { useState, useEffect } from 'react';
import ProductSelector from '../components/Billing/ProductSelector';
import BillTable from '../components/Billing/BillTable';
import BillSummary from '../components/Billing/BillSummary';
import { fetchProducts, seedProducts } from '../services/ProductService';
import { saveBill } from '../services/BillService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ToastNotification from '../components/Layout/ToastNotification';

const BillingPage = () => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(true);
    const [lastSavedBill, setLastSavedBill] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

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

    const handleSeed = async () => {
        if (window.confirm("Add dummy products to database?")) {
            try {
                await seedProducts();
                alert("Products seeded successfully!");
                loadProducts();
            } catch (error) {
                console.error("Seed error:", error);
                alert(`Failed to seed products: ${error.message}`);
            }
        }
    };

    const addItemToBill = (product, quantity) => {
        const newItem = {
            productId: product.id,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            total: product.price * quantity
        };
        setCartItems([...cartItems, newItem]);
    };

    const removeItemFromBill = (index) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const clearBill = () => {
        if (window.confirm("Are you sure you want to clear the bill?")) {
            setCartItems([]);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const generatePDF = (billId, items, subtotal, grandTotal) => {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();

        doc.text(`Grocery Shop Invoice`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Bill ID: ${billId}`, 14, 30);
        doc.text(`Date: ${date}`, 14, 35);

        const tableColumn = ["Product", "Price", "Qty", "Total"];
        const tableRows = [];

        items.forEach(item => {
            const itemData = [
                item.productName,
                item.price.toFixed(2),
                item.quantity,
                item.total.toFixed(2)
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 15);

        const fileName = `${billId}_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;
        doc.save(fileName);
    };

    const handleSaveBill = async () => {
        if (cartItems.length === 0) return;

        // Check for duplicate bill (simple check: same items and quantity as last saved)
        const currentBillSignature = JSON.stringify(cartItems);
        if (lastSavedBill === currentBillSignature) {
            setToast({ show: true, message: 'Bill already added!', type: 'error' });
            return;
        }

        try {
            const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
            const grandTotal = subtotal;

            const billData = {
                items: cartItems,
                subtotal: subtotal,
                grandTotal: grandTotal,
            };
            const billId = await saveBill(billData);

            setLastSavedBill(currentBillSignature);
            generatePDF(billId, cartItems, subtotal, grandTotal);

            setToast({ show: true, message: 'Invoice stored successfully!', type: 'success' });
            // setCartItems([]); // User requested to keep items to test duplicate check? "when the owner again clicks the add bill button with the same bill again" -> implies items stay.
        } catch (error) {
            console.error("Save Bill Error:", error);
            setToast({ show: true, message: `Failed to save bill: ${error.message}`, type: 'error' });
        }
    };

    return (
        <div className="container mt-4">
            <ToastNotification
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                <h2>Billing</h2>
                <div>
                    <button className="btn btn-warning me-2" onClick={clearBill} disabled={cartItems.length === 0}>Clear</button>
                    <button className="btn btn-info me-2" onClick={handleSaveBill} disabled={cartItems.length === 0}>Save Bill</button>
                    <button className="btn btn-primary" onClick={handlePrint} disabled={cartItems.length === 0}>Print</button>
                </div>
            </div>

            {products.length === 0 && !loading && (
                <div className="alert alert-warning no-print">
                    No products found. <button className="btn btn-sm btn-outline-dark" onClick={handleSeed}>Seed Dummy Products</button>
                </div>
            )}

            <div className="row">
                <div className="col-md-8">
                    <div className="no-print">
                        <ProductSelector products={products} onAddItem={addItemToBill} />
                    </div>
                    <BillTable items={cartItems} onRemoveItem={removeItemFromBill} />
                </div>
                <div className="col-md-4">
                    <BillSummary items={cartItems} />
                </div>
            </div>

            {/* Print only section header if needed, but usually the table is enough */}
            <div className="d-none d-print-block text-center mt-5">
                <h3>Grocery Shop</h3>
                <p>Thank you for shopping with us!</p>
            </div>
        </div>
    );
};

export default BillingPage;
