export const defaultRunInContextOption = {
  displayErrors: true,
  timeout: 3000,
};

export const defaultContext = {
  require: (arg: string) => {
    throw new Error(`"require" not supported: ${arg}`);
  },
  import: (arg: string) => {
    throw new Error(`"import" not supported: ${arg}`);
  },
};
