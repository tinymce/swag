import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';

const transform = (code: string): any => {
  const body = parse(code);

  patch(body);

  return {
    code: serialize(body),
    map: { version: 3, sources: [], mappings: '' }
  };
};

const patchExports = () => {
  return {
    name: 'swag-patch-exports',
    transform
  };
};

export {
  patchExports
};
