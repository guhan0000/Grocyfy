import React, { useEffect } from 'react';

const ToastNotification = ({ message, show, onClose, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';

    return (
        <div
            className={`toast show position-fixed bottom-0 end-0 m-3 text-white ${bgColor}`}
            role="alert"
            style={{ zIndex: 1050 }}
        >
            <div className="toast-body d-flex justify-content-between">
                <span>{message}</span>
                <button type="button" className="btn-close btn-close-white ms-2" onClick={onClose}></button>
            </div>
        </div>
    );
};

export default ToastNotification;
