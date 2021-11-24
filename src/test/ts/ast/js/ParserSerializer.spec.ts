import { expect } from 'chai';
import 'mocha';

import { parse } from '../../../../main/ts/ast/js/Parser';
import { serialize } from '../../../../main/ts/ast/js/Serializer';

describe('Parser/Serializer', () => {
  it('should handle unicode correctly when parsing/serializing', () => {
    const ast = parse([
      'var x = { x: "a\\ufeff\ufeff" };'
    ].join('\n'));

    expect(serialize(ast)).to.equal([
      'var x = { x: \'a\\uFEFF\\uFEFF\' };'
    ].join('\n'));
  });

  it('should handle optional chaining when parsing/serializing', () => {
    const ast = parse([
      'const x = {};',
      'let a = x?.b;'
    ].join('\n'));

    expect(serialize(ast)).to.equal([
      'const x = {};',
      'let a = x?.b;'
    ].join('\n'));
  });
});
