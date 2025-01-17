import React from "react";

interface ModalProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
  actionText: string; // Tambahan untuk menentukan teks tombol
}

const Modal: React.FC<ModalProps> = ({
  title,
  value,
  onChange,
  onClose,
  onSave,
  actionText,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter name"
          className="w-full px-3 py-2 border rounded-md mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
