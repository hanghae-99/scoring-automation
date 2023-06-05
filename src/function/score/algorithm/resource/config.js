export const defaultRunInContextOption = {
  displayErrors: true,
  timeout: 3000,
};

export const defaultContext = {
  require: (arg) => {
    throw new Error(`"require" not supported: ${arg}`);
  },
  import: (arg) => {
    throw new Error(`"import" not supported: ${arg}`);
  },
};
