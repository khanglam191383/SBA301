import Modal from './Modal';
import { IconAlertTriangle, IconTrash } from './Icons';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete Permanently",
  cancelText = "Cancel"
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div className="confirm-dialog">
        <div className="confirm-icon-wrap">
          <IconAlertTriangle size={32} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
          >
            <IconTrash size={16} />
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
