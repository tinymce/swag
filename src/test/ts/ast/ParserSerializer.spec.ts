import { parse } from '../../../main/ts/ast/Parser';
import { serialize } from '../../../main/ts/ast/Serializer';
import { expect } from 'chai';
import 'mocha';

describe('Parser/Serializer', () => {
  it('should handle unicode correctly when parsing/serializing', () => {
    let ast = parse([
      'var x = { x: "a\\ufeff\ufeff" };'
    ].join('\n'));

    expect(serialize(ast)).to.equal([
      'var x = { x: \'a\\uFEFF\\uFEFF\' };'
    ].join('\n'));
  });
});
