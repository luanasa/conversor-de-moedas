import React from 'react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  currency,
  label,
  placeholder = "0.00",
  disabled = false
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string, numbers, and decimal point
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-16 text-lg border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 ${
            disabled 
              ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-75' 
              : 'hover:border-blue-400'
          }`}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {currency}
        </div>
      </div>
    </div>
  );
}