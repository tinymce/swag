import * as escodegen from 'escodegen';
import * as estree from 'estree';

var escapeStr = function (str: string): string {
  return str.replace(/[\u007f-\uffff]/g, function (ch) {
    var code = ch.charCodeAt(0).toString(16);
    if (code.length <= 2) {
        while (code.length < 2) code = "0" + code;
        return "\\x" + code;
    } else {
        while (code.length < 4) code = "0" + code;
        return "\\u" + code;
    }
  });
};

let serialize = (node: estree.Node): string => {
  let code = escodegen.generate(node, {
    comment: true,
    format: {
      indent: {
        style: '  ',
        base: 0
      },
      preserveBlankLines: false,
      safeConcatenation: true
    }
  });

  return escapeStr(code.trim());
};

export {
  serialize
}