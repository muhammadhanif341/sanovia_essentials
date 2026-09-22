import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Alert } from '@/components/icons';
import './forms.css';

/**
 * Accessible field wrapper: label, hint and error are wired to the control via
 * htmlFor / aria-describedby / aria-invalid. Children is a render function that
 * receives the props to spread onto the control:
 *
 *   <Field label="Name" error={err} required>
 *     {(p) => <input className="sv-input" {...p} />}
 *   </Field>
 *
 * Convenience wrappers below cover the common controls.
 */
export function Field({ label, hint, error, required, hideLabel, className, id: idProp, children }) {
  const auto = useId();
  const id = idProp ?? auto;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const controlProps = {
    id,
    required: required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
  };

  return (
    <div className={cn('sv-field', error && 'sv-field--error', className)}>
      <label className={cn('sv-field__label t-overline', hideLabel && 'sv-sr-only')} htmlFor={id}>
        {label}
        {required && (
          <span className="sv-field__label-req" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children(controlProps)}
      {hint && (
        <p id={hintId} className="sv-field__hint t-small">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="sv-field__error t-small">
          <Alert size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function TextField({ label, hint, error, required, hideLabel, className, inputClassName, ref, ...input }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} className={className}>
      {(p) => <input ref={ref} className={cn('sv-input', inputClassName)} {...p} {...input} />}
    </Field>
  );
}

export function TextareaField({ label, hint, error, required, className, ref, ...input }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(p) => <textarea ref={ref} className="sv-textarea" {...p} {...input} />}
    </Field>
  );
}

/** options: [{ value, label }] */
export function SelectField({ label, hint, error, required, hideLabel, options, className, ref, ...select }) {
  return (
    <Field label={label} hint={hint} error={error} required={required} hideLabel={hideLabel} className={className}>
      {(p) => (
        <div className="sv-select">
          <select ref={ref} className="sv-select__control" {...p} {...select}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </Field>
  );
}

export function CheckboxField({ label, hint, className, ref, ...input }) {
  const id = useId();
  return (
    <div className={cn('sv-field', className)}>
      <label className="sv-check" htmlFor={id}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="sv-check__input"
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...input}
        />
        <span className="sv-check__text t-small">{label}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="sv-field__hint t-small">
          {hint}
        </p>
      )}
    </div>
  );
}
