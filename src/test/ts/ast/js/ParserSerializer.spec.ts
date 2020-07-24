import { parse } from '../../../../main/ts/ast/js/Parser';
import { serialize } from '../../../../main/ts/ast/js/Serializer';
import { expect } from 'chai';
import 'mocha';

describe('Parser/Serializer', () => {
  it('should handle unicode correctly when parsing/serializing', () => {
    const ast = parse([
      'var x = { x: "a\\ufeff\ufeff" };'
    ].join('\n'));

    expect(serialize(ast)).to.equal([
      'var x = { x: \'a\\uFEFF\\uFEFF\' };'
    ].join('\n'));
  });
});
