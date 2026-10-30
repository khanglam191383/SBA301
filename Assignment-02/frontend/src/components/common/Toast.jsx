import { IconCheck, IconAlertTriangle, IconX } from './Icons';

export default function ToastContainer({ toasts = [], onRemoveToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {toast.type === 'success' && <IconCheck size={18} style={{ color: 'var(--success-600)' }} />}
            {toast.type === 'danger' && <IconAlertTriangle size={18} style={{ color: 'var(--danger-600)' }} />}
            <span>{toast.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => onRemoveToast(toast.id)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', display: 'flex' }}
          >
            <IconX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
