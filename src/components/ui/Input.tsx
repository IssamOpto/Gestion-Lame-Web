import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const Input: React.FC<InputProps> = ({ label, id, icon, onIconClick, required, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>}
      <div className="relative">
        <input
          id={id}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          {...props}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
