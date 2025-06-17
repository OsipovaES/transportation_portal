import styles from "./input.module.css";

export const Input = ({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  error,
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}{" "}
    </div>
  );
};
