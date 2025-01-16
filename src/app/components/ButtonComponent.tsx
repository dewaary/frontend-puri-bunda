import React from 'react';

type ButtonProps = {
  text: string;            // Teks pada tombol
  onClick: () => void;     // Fungsi yang dipanggil saat tombol diklik
  color?: string;          // Warna tombol (opsional, defaultnya biru)
};

const ButtonComponent: React.FC<ButtonProps> = ({ text, onClick, color = "blue" }) => {
  const buttonClass = `px-6 py-2 rounded-md text-white hover:opacity-80 transition-colors ${
    color === 'blue' ? 'bg-blue-600' : 'bg-gray-600'
  }`;

  return (
    <button onClick={onClick} className={buttonClass}>
      {text}
    </button>
  );
};

export default ButtonComponent;