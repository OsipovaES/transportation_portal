import styles from "./form.module.css";
import { Input } from "../Input";
import { Button } from "../Button";

export const Form = ({
  description,
  inputs,
  selects,
  onSubmit,
  buttonText,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {description && <p className={styles.description}>{description}</p>}

      {inputs &&
        inputs.map((input, index) => (
          <Input
            key={index}
            label={input.label}
            placeholder={input.placeholder}
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            error={input.error}
          />
        ))}

      {selects &&
        selects.map((select, index) => (
          <div key={index} className={styles.selectWrapper}>
            <label htmlFor={select.name}>{select.label}</label>
            <select
              id={select.name}
              name={select.name}
              value={select.value} // <--- тут value из пропсов
              onChange={select.onChange} // <--- и onChange из пропсов
              className={styles.select}
            >
              <option value="" disabled>
                Выберите {select.label.toLowerCase()}
              </option>
              {select.options.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {select.error && <p className={styles.error}>{select.error}</p>}
          </div>
        ))}

      <Button type="submit">{buttonText || "Submit"}</Button>
    </form>
  );
};
