import { expect } from 'chai';
import 'mocha';

import { parseComments, parseImports } from '../../../main/ts/imports/RawSourceParser';

describe('RawSourceParser', () => {
  it('should parse single line comments', () => {
    expect(parseComments('// x')).to.deep.equal([{ start: 0, end: 4, text: '// x' }]);
    expect(parseComments('var x = 1;\n// x')).to.deep.equal([{ start: 11, end: 15, text: '// x' }]);
    expect(parseComments('// x\n// y')).to.deep.equal([
      { start: 0, end: 4, text: '// x' },
      { start: 5, end: 9, text: '// y' }
    ]);
    expect(parseComments('// x\nvar x = 1;\n// y')).to.deep.equal([
      { start: 0, end: 4, text: '// x' },
      { start: 16, end: 20, text: '// y' }
    ]);
  });

  it('should parse multiline comments', () => {
    expect(parseComments('/* x */')).to.deep.equal([{ start: 0, end: 7, text: '/* x */' }]);
    expect(parseComments('/* x\ny */')).to.deep.equal([{ start: 0, end: 9, text: '/* x\ny */' }]);
    expect(parseComments('/* x */\nvar x = 1;\n/* y */')).to.deep.equal([
      { start: 0, end: 7, text: '/* x */' },
      { start: 19, end: 26, text: '/* y */' }
    ]);
  });

  it('should parse import formats with double quotes', () => {
    const importFormatsDoubleQuotes = [
      'import {',
      '  Component',
      '} from "@something/something";',
      'import defaultMember from "module-name";',
      'import   *    as name from "module-name  ";',
      'import   {',
      'member',
      '}   from "  module-name";',
      'import { member as alias } from "module-name";',
      'import { member1 , member2 } from "module-name";',
      'import { member1 , member2 as alias2 , member3 as alias3 } from "module-name";',
      'import defaultMember, { member, member } from "module-name";',
      'import defaultMember, * as name from "module-name";',
      'import "module-name";',
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 0, end: 51, text: 'import {\n  Component\n} from "@something/something";' },
      { start: 52, end: 92, text: 'import defaultMember from "module-name";' },
      { start: 93, end: 136, text: 'import   *    as name from "module-name  ";' },
      { start: 137, end: 180, text: 'import   {\nmember\n}   from "  module-name";' },
      { start: 181, end: 227, text: 'import { member as alias } from "module-name";' },
      { start: 228, end: 276, text: 'import { member1 , member2 } from "module-name";' },
      { start: 277, end: 355, text: 'import { member1 , member2 as alias2 , member3 as alias3 } from "module-name";' },
      { start: 356, end: 416, text: 'import defaultMember, { member, member } from "module-name";' },
      { start: 417, end: 468, text: 'import defaultMember, * as name from "module-name";' },
      { start: 469, end: 490, text: 'import "module-name";' }
    ]);
  });

  it('should parse import formats with single quotes', () => {
    const importFormatsDoubleQuotes = [
      'import {',
      '  Component',
      '} from \'@something/something\';',
      'import defaultMember from \'module-name\';',
      'import   *    as name from \'module-name  \';',
      'import   {',
      'member',
      '}   from \'  module-name\';',
      'import { member as alias } from \'module-name\';',
      'import { member1 , member2 } from \'module-name\';',
      'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\';',
      'import defaultMember, { member, member } from \'module-name\';',
      'import defaultMember, * as name from \'module-name\';',
      'import \'module-name\';',
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 0, end: 51, text: 'import {\n  Component\n} from \'@something/something\';' },
      { start: 52, end: 92, text: 'import defaultMember from \'module-name\';' },
      { start: 93, end: 136, text: 'import   *    as name from \'module-name  \';' },
      { start: 137, end: 180, text: 'import   {\nmember\n}   from \'  module-name\';' },
      { start: 181, end: 227, text: 'import { member as alias } from \'module-name\';' },
      { start: 228, end: 276, text: 'import { member1 , member2 } from \'module-name\';' },
      { start: 277, end: 355, text: 'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\';' },
      { start: 356, end: 416, text: 'import defaultMember, { member, member } from \'module-name\';' },
      { start: 417, end: 468, text: 'import defaultMember, * as name from \'module-name\';' },
      { start: 469, end: 490, text: 'import \'module-name\';' }
    ]);
  });

  it('should parse import formats with no semicolons', () => {
    const importFormatsDoubleQuotes = [
      'import {',
      '  Component',
      '} from \'@something/something\'',
      'import defaultMember from \'module-name\'',
      'import   *    as name from \'module-name  \'',
      'import   {',
      'member',
      '}   from \'  module-name\'',
      'import { member as alias } from \'module-name\'',
      'import { member1 , member2 } from \'module-name\'',
      'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\'',
      'import defaultMember, { member, member } from \'module-name\'',
      'import defaultMember, * as name from \'module-name\'',
      'import \'module-name\''
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 0, end: 50, text: 'import {\n  Component\n} from \'@something/something\'' },
      { start: 51, end: 90, text: 'import defaultMember from \'module-name\'' },
      { start: 91, end: 133, text: 'import   *    as name from \'module-name  \'' },
      { start: 134, end: 176, text: 'import   {\nmember\n}   from \'  module-name\'' },
      { start: 177, end: 222, text: 'import { member as alias } from \'module-name\'' },
      { start: 223, end: 270, text: 'import { member1 , member2 } from \'module-name\'' },
      { start: 271, end: 348, text: 'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\'' },
      { start: 349, end: 408, text: 'import defaultMember, { member, member } from \'module-name\'' },
      { start: 409, end: 459, text: 'import defaultMember, * as name from \'module-name\'' },
      { start: 460, end: 480, text: 'import \'module-name\'' }
    ]);
  });

  it('should parse multiline import formats', () => {
    const importFormatsDoubleQuotes = [
      'import defaultMember from \'module-name\'; import   *    as name from \'module-name  \';',
      'import { member as alias } from \'module-name\'; import { member1 , member2 } from \'module-name\';',
      'import defaultMember, { member, member } from \'module-name\'; import defaultMember, * as name from \'module-name\';',
      'import \'module-name\';'
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 0, end: 40, text: 'import defaultMember from \'module-name\';' },
      { start: 41, end: 84, text: 'import   *    as name from \'module-name  \';' },
      { start: 85, end: 131, text: 'import { member as alias } from \'module-name\';' },
      { start: 132, end: 180, text: 'import { member1 , member2 } from \'module-name\';' },
      { start: 181, end: 241, text: 'import defaultMember, { member, member } from \'module-name\';' },
      { start: 242, end: 293, text: 'import defaultMember, * as name from \'module-name\';' },
      { start: 294, end: 315, text: 'import \'module-name\';' }
    ]);
  });

  it('should parse import formats with trailing comments', () => {
    const importFormatsDoubleQuotes = [
      'import {',
      '  Component',
      '} from \'@something/something\'; \\\\ Some comment 1',
      'import defaultMember from \'module-name\'; \\\\ Some comment 2',
      'import   *    as name from \'module-name  \'; \\\\ Some comment 3',
      'import   {',
      'member',
      '}   from \'  module-name\'; \\ Some comment 4',
      'import { member as alias } from \'module-name\'; \\\\ Some comment 5',
      'import { member1 , member2 } from \'module-name\'; \\\\ Some comment 6',
      'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\'; \\\\ Some comment 7',
      'import defaultMember, { member, member } from \'module-name\'; \\\\ Some comment 8',
      'import defaultMember, * as name from \'module-name\'; \\\\ Some comment 9',
      'import \'module-name\'; \\\\ Some comment 10',
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 0, end: 51, text: 'import {\n  Component\n} from \'@something/something\';' },
      { start: 70, end: 110, text: 'import defaultMember from \'module-name\';' },
      { start: 129, end: 172, text: 'import   *    as name from \'module-name  \';' },
      { start: 191, end: 234, text: 'import   {\nmember\n}   from \'  module-name\';' },
      { start: 252, end: 298, text: 'import { member as alias } from \'module-name\';' },
      { start: 317, end: 365, text: 'import { member1 , member2 } from \'module-name\';' },
      { start: 384, end: 462, text: 'import { member1 , member2 as alias2 , member3 as alias3 } from \'module-name\';' },
      { start: 481, end: 541, text: 'import defaultMember, { member, member } from \'module-name\';' },
      { start: 560, end: 611, text: 'import defaultMember, * as name from \'module-name\';' },
      { start: 630, end: 651, text: 'import \'module-name\';' }
    ]);
  });

  it('should not parse imports in comments', () => {
    const importFormatsDoubleQuotes = [
      '/*',
      'import {',
      '  Component',
      '} from \'@something/not-this-package\';',
      '*/',
      'import defaultMember from \'module-name\';',
      '// import defaultMember from \'not-this-module-name\';'
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 65, end: 105, text: 'import defaultMember from \'module-name\';' }
    ]);
  });

  it('should not parse imports in strings', () => {
    const importFormatsDoubleQuotes = [
      'var a = "import * from \'not-this-module-name\'";',
      'var a = \'import * from "not-this-module-name"\';',
      'import defaultMember from \'module-name\';'
    ].join('\n');

    expect(parseImports(importFormatsDoubleQuotes)).to.deep.equal([
      { start: 96, end: 136, text: 'import defaultMember from \'module-name\';' }
    ]);
  });

  it('should not parse functions called import', () => {
    const importFormat = [
      'import defaultMember from \'module-name\';',
      'var wordimport = function (cleaner, createDialog, config) {'
    ].join('\n');

    expect(parseImports(importFormat)).to.deep.equal([
      { start: 0, end: 40, text: 'import defaultMember from \'module-name\';' }
    ]);
  });
});
