import React from "react";

interface TextInputProps {
  type: string;
  name: string;
  placeholder: string;
  isReq?: boolean;
  isTextArea?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
}

export default function TextInput({
  type,
  name,
  placeholder,
  isReq,
  isTextArea,
  value,
  onChange,
  error,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {isTextArea ? (
        <>
          <label htmlFor={name} className="text-text text-sm font-semibold">
            {placeholder}
          </label>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={5}
            className={`p-3 rounded-sm border-[1px] duration-300 outline-none text-text hover:shadow-shadow focus:shadow-shadow ${
              error
                ? "border-red-500 focus:border-red-500 hover:border-red-500 shadow-warning-shadow focus:shadow-warning-shadow"
                : "border-primary-20 hover:border-primary focus:border-primary"
            } `}
          ></textarea>
        </>
      ) : (
        <>
          <label htmlFor={name} className="text-text text-sm font-semibold">
            {placeholder} {isReq && <span className="text-red-500">*</span>}
          </label>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`p-3 rounded-sm border-[1px] duration-300 outline-none text-text hover:shadow-shadow focus:shadow-shadow ${
              error
                ? "border-red-500 focus:border-red-500 hover:border-red-500 shadow-warning-shadow focus:shadow-warning-shadow"
                : "border-primary-20 hover:border-primary focus:border-primary"
            } `}
          />
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
