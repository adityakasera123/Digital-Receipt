const Input = ({
  label,
  type = "text",
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-3 outline-none transition-all
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-600"
        }
        disabled:bg-gray-100`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;