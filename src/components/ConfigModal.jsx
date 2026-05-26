import { useEffect, useRef } from 'react';

export default function ConfigModal({ isOpen, title, children, onClose, onSave }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function onKey(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="configModalOverlay" onClick={onClose}>
      <div className="configModal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="configModalHeader">
          <span className="configModalTitle">{title}</span>
          <button
            className="configModalClose"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="configModalContent">
          {children}
        </div>
        <div className="configModalFooter">
          <button
            className="configModalSave"
            type="button"
            onClick={() => { onSave(); onClose(); }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
