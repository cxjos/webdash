import { useEffect, useRef } from 'react';
import { CARD_TYPES } from '../cardTypes';

const typeOrder = ['weather', 'currency', 'time'];

export default function TypePicker({ isOpen, onSelect, onClose }) {
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
    <div className="typePickerOverlay" onClick={onClose}>
      <div className="typePickerModal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {typeOrder.map((typeId) => {
          const type = CARD_TYPES[typeId];
          return (
            <button
              key={typeId}
              className="typePickerOption"
              type="button"
              onClick={() => { onSelect(typeId); onClose(); }}
            >
              <span className="typePickerIcon">{type.icon}</span>
              <span className="typePickerLabel">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}