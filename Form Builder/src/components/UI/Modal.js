import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full',
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${sizeClasses[size]} ${className || ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body
  );
};

// Modal Components for Convenience
Modal.Header = ({ children, className }) => (
  <div className={`modal-section-header ${className || ''}`}>
    {children}
  </div>
);

Modal.Body = ({ children, className, noPadding }) => (
  <div className={`modal-section-body ${noPadding ? 'no-padding' : ''} ${className || ''}`}>
    {children}
  </div>
);

Modal.Footer = ({ children, className }) => (
  <div className={`modal-section-footer ${className || ''}`}>
    {children}
  </div>
);

Modal.Description = ({ children, className }) => (
  <p className={`modal-description ${className || ''}`}>
    {children}
  </p>
);

Modal.Actions = ({ children, className }) => (
  <div className={`modal-actions ${className || ''}`}>
    {children}
  </div>
);

export { Modal };