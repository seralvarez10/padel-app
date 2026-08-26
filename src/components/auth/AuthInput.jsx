import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import styles from "./AuthInput.module.css";

export default function AuthInput({
  label,
  icon: Icon,
  error,
  type = "text",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword
      ? "text"
      : type;

  return (
    <div className={styles.field}>

      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={`${styles.inputContainer} ${
          error ? styles.errorBorder : ""
        }`}
      >

        {Icon && (
          <Icon
            size={20}
            className={styles.icon}
          />
        )}

        <input
          className={styles.input}
          type={inputType}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.passwordButton}
            onClick={() =>
              setShowPassword((value) => !value)
            }
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}

      </div>

      {error && (
        <span className={styles.error}>
          {error}
        </span>
      )}

    </div>
  );
}