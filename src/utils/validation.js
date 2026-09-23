/** Checkout form validation — plain functions, no form-library dependency (matches the rest
 * of this project: real `<form>` markup + client-side `required`, see pages/Account.jsx). */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts +, spaces, dashes, parens; requires 7–15 digits once stripped, per E.164 practical range.
const PHONE_DIGITS_RE = /^\+?[0-9\s\-().]{7,20}$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value ?? '').trim());

export function isValidPhone(value) {
  const v = String(value ?? '').trim();
  if (!PHONE_DIGITS_RE.test(v)) return false;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export const isRequired = (value) => String(value ?? '').trim().length > 0;

/** @returns {Record<string,string>} field name → error message, only for invalid fields. */
export function validateCustomer({ firstName, lastName, email, phone } = {}) {
  const errors = {};
  if (!isRequired(firstName)) errors.firstName = 'First name is required.';
  if (!isRequired(lastName)) errors.lastName = 'Last name is required.';
  if (!isRequired(email)) errors.email = 'Email is required.';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(phone)) errors.phone = 'Phone number is required.';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid phone number.';
  return errors;
}

export function validateAddress({ country, city, state, street, postalCode } = {}) {
  const errors = {};
  if (!isRequired(country)) errors.country = 'Country is required.';
  if (!isRequired(city)) errors.city = 'City is required.';
  if (!isRequired(state)) errors.state = 'State/Province is required.';
  if (!isRequired(street)) errors.street = 'Street address is required.';
  if (!isRequired(postalCode)) errors.postalCode = 'Postal/ZIP code is required.';
  return errors;
}

export function validateCardDetails({ cardNumber, cardExpiry, cardCvc, cardName } = {}) {
  const errors = {};
  const digits = String(cardNumber ?? '').replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) errors.cardNumber = 'Enter a valid card number.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(cardExpiry ?? '').trim())) {
    errors.cardExpiry = 'Use MM/YY.';
  }
  if (!/^\d{3,4}$/.test(String(cardCvc ?? '').trim())) errors.cardCvc = 'Enter a valid security code.';
  if (!isRequired(cardName)) errors.cardName = 'Name on card is required.';
  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
