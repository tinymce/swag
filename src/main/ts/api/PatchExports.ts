import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';

let transform = (code: string): any => {
  let body = parse(code);

  patch(body);

  return {
    code: serialize(body),
    map: { version: 3, sources: [], mappings: '' }
  };
};

let patchExports = () => {
  return {
    name: 'swag-patch-exports',
    transform: transform
  };
};

export {
  patchExports
}
