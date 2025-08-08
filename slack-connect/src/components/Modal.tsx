import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="text-gray-700 dark:text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-150"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;