import { RollupWarning } from 'rollup';

const message = (warning: RollupWarning) => {
  if (warning.loc) {
    const loc = warning.loc;
    const locText = `file: ${loc.file} line ${loc.line}:${loc.column}`;
    const frame = warning.frame ? `\n${warning.frame}\n\n` : '';
    return `${warning.message} ${locText} ${frame}`;
  } else {
    return warning.message;
  }
};

const fail = (warning: RollupWarning): never => {
  throw new Error(message(warning));
};

const warn = (warning: RollupWarning) => {
  // eslint-disable-next-line no-console
  console.warn(warning.code, message(warning));
};

export const onwarn = (warning: RollupWarning): void | never => {
  if (warning.code === 'EMPTY_EXPORT') {
    return;
  } else if (warning.code === 'UNRESOLVED_IMPORT') {
    fail(warning);
  } else if (warning.code === 'CIRCULAR_DEPENDENCY') {
    fail(warning);
  } else if (warning.code === 'THIS_IS_UNDEFINED') {
    fail(warning);
  } else if (warning.code === 'MISSING_EXPORT') {
    fail(warning);
  }

  warn(warning);
};
