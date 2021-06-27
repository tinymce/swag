export interface RawToken {
  readonly start: number;
  readonly end: number;
  readonly text: string;
}

const tokenize = (regex: RegExp, code: string) => {
  const tokens: RawToken[] = [];
  let matches: RegExpExecArray;

  while ((matches = regex.exec(code))) {
    tokens.push({ start: matches.index, end: matches.index + matches[0].length, text: matches[0] });
  }

  return tokens;
};

export const parseComments = (code: string): RawToken[] => {
  const regex = /\/\*[^]*?\*\/|[\t ]*\/\/[^\n]+/g;
  return tokenize(regex, code);
};

const parseImportStringLiterals = (code: string): RawToken[] => {
  const regex = /\'[^'\r\n;]*import[^'\r\n]*\'|\"[^"\r\n;]*import[^"\r\n]*\"/g;
  return tokenize(regex, code);
};

export const parseImports = (code: string): RawToken[] => {
  const regex = /import(?:\s+([\w*{}\n\r\t, ]+)from)?\s+["']\s*([@\w./_-]+)\s*["'](?:\s*;)?/g;
  const comments = parseComments(code);
  const importStringLiterals = parseImportStringLiterals(code);
  const notContainsIn = (tokens) => (imp) => tokens.findIndex((token) => imp.start > token.start && imp.start < token.end) === -1;
  return tokenize(regex, code).filter(notContainsIn(comments)).filter(notContainsIn(importStringLiterals));
};

export const importsToText = (tokens: RawToken[]): string => {
  return tokens.map((token) => token.text).join('\n');
};
