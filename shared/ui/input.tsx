type InputType = 'text' | 'email' | 'password' | 'number' | 'search';

interface InputProps {
  type?: InputType;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export function Input({
  type = 'text',
  label,
  placeholder,
  className = '',
  id,
  name,
  value,
  defaultValue,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
}: InputProps) {
  const inputId = id ?? name;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${className}`.trim()}
      />
    </div>
  );
}
