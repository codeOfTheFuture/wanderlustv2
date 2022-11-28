import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  color: "btn-primary" | "btn-error";
  size: "btn-xl" | "btn-lg" | "btn-md" | "btn-sm";
  type: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FC<Props> = props => {
  const { children, color, size, type, disabled, onClick } = props;

  return (
    <button
      className={`${color} ${size}`}
      type={type}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
