import { ButtonHTMLAttributes } from "react";
import BeatLoader from "react-spinners/BeatLoader";

type ButtonProps = {
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  const { loading, disabled, children, ...rest } = props;

  return (
    <button
      className="h-12 rounded-lg bg-app-primary px-4 py-2 text-xl font-semibold text-white"
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <BeatLoader size={8} color="#FFFFFF" /> : children}
    </button>
  );
};

export default Button;
