export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>?¿])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>?¿]{8,}$/;
  return passwordRegex.test(password);
};
