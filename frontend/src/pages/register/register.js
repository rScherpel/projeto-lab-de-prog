// Password validation logic
export const getPasswordChecks = (password) => ({
  hasMinLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

export const passwordRequirements = [
  {
    key: "hasMinLength",
    message: "A senha deve ter pelo menos 8 caracteres",
  },
  {
    key: "hasUppercase",
    message: "A senha deve ter pelo menos 1 letra maiúscula",
  },
  {
    key: "hasNumber",
    message: "A senha deve ter pelo menos 1 número",
  },
  {
    key: "hasSpecialChar",
    message: "A senha deve ter pelo menos 1 caractere especial",
  },
];

export const getMissingRequirements = (passwordChecks) =>
  passwordRequirements.filter((req) => !passwordChecks[req.key]);

export const checkPasswordsMatch = (password, confirmPassword) =>
  confirmPassword.length > 0 && password === confirmPassword;

export const canSubmitForm = (email, missingRequirements, passwordsMatch) =>
  email.trim() !== "" && missingRequirements.length === 0 && passwordsMatch;

export const handleRegisterSubmit = async (email, password) => {
  const response = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data.message;
};
