const message = (warning) => {
  if (warning.loc) {
    const loc = warning.loc;
    const locText = `file: ${loc.file} line ${loc.line}:${loc.column}`;
    const frame = warning.frame ? `\n${warning.frame}\n\n` : '';
    return `${warning.message} ${locText} ${frame}`;
  } else {
    return warning.message;
  }
};

const fail = (warning): never => {
  throw new Error(message(warning));
};

const warn = (warning) => {
  // tslint:disable-next-line:no-console
  console.warn(warning.code, message(warning));
};

export const onwarn = (warning) => {
  if (warning.code === 'EMPTY_EXPORT') { return; }
  if (warning.code === 'UNRESOLVED_IMPORT') { fail(warning); }
  if (warning.code === 'CIRCULAR_DEPENDENCY') { fail(warning); }
  if (warning.code === 'THIS_IS_UNDEFINED') { fail(warning); }
  if (warning.code === 'MISSING_EXPORT') { fail(warning); }

  warn(warning);
};
