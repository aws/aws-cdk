import * as fs from 'fs';
import * as yaml from 'yaml';
import * as yaml_cst from 'yaml/parse-cst';
import * as yaml_types from 'yaml/types';

function makeTagForCfnIntrinsic(
  intrinsicName: string, addFnPrefix: boolean = true,
  resolveFun?: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => any): yaml_types.Schema.Tag {

  return {
    identify(value: any) { return typeof value === 'string'; },
    tag: `!${intrinsicName}`,
    resolve: resolveFun || ((_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
      const ret: any = {};
      ret[addFnPrefix ? `Fn::${intrinsicName}` : intrinsicName] =
        // the +1 is to account for the ! the short form begins with
        yaml.parse(cstNode.toString().substring(intrinsicName.length + 1));
      return ret;
    }),
  };
}

export const shortForms: yaml_types.Schema.Tag[] = [
  'Base64', 'Cidr', 'FindInMap', 'GetAZs', 'ImportValue', 'Join',
  'Select', 'Split', 'Transform', 'And', 'Equals', 'If', 'Not', 'Or',
].map(name => makeTagForCfnIntrinsic(name)).concat(
  // ToDo: special logic for ImportValue will be needed when support for Fn::Sub is added. See
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
  makeTagForCfnIntrinsic('Ref', false),
  makeTagForCfnIntrinsic('GetAtt', true, (_doc: yaml.Document, cstNode: yaml_cst.CST.Node): any => {
    // The position of the leftmost period and opening bracket tell us what syntax is being used
    // If no brackets are found, then the dot notation is being used; the leftmost dot separates the
    // logical ID from the attribute.
    //
    // If a bracket is found, then the list notation is being used; if present, the leftmost dot separates the
    // logical ID from the attribute.
    const firstDot = cstNode.toString().indexOf('.');
    const firstBracket = cstNode.toString().indexOf('[');

    return {
      'Fn::GetAtt': firstDot !== -1 && firstBracket === -1
        ? [
          cstNode.toString().substring('!GetAtt '.length, firstDot),
          yaml.parse((cstNode.toString().substring(firstDot + 1))),
        ]
        : yaml.parse(cstNode.toString().substring('!GetAtt'.length)),
    };
  }),
);

/*
const ref:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Ref',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      Ref: (yaml.parse(cstNode.toString().substring('!Ref'.length))),
    };
  },
};
const base64:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Base64',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Base64': (yaml.parse(cstNode.toString().substring('!Base64'.length))),
    };
  },
};
const cidr:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Cidr',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Cidr': (yaml.parse(cstNode.toString().substring('!Cidr'.length))),
    };
  },
};
const findInMap:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!FindInMap',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::FindInMap': (yaml.parse(cstNode.toString().substring('!FindInMap'.length))),
    };
  },
};
const getAtt:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!GetAtt',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    const lastDot = cstNode.toString().lastIndexOf('.');

    if (lastDot !== -1) {
      return {
        'Fn::GetAtt': [
          //TODO it should be first dot, logical IDs can't have dots. add a test case
          cstNode.toString().substring('!GetAtt '.length, lastDot),
          yaml.parse((cstNode.toString().substring(lastDot + 1))),
        ],
      };
    }

    return {
      'Fn::GetAtt': (yaml.parse(cstNode.toString().substring('!GetAtt'.length))),
    };
  },
};
const getAZs:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!GetAZs',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::GetAZs': (yaml.parse(cstNode.toString().substring('!GetAZs'.length))),
    };
  },
};
const importValue:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!ImportValue',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::ImportValue': (yaml.parse(cstNode.toString().substring('!ImportValue'.length))),
    };
  },
};
const join:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Join',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Join': (yaml.parse(cstNode.toString().substring('!Join'.length))),
    };
  },
};
const select:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Select',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Select': (yaml.parse(cstNode.toString().substring('!Select'.length))),
    };
  },
};
const split:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Split',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Split': (yaml.parse(cstNode.toString().substring('!Split'.length))),
    };
  },
};
const transform:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Transform',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Transform': (yaml.parse(cstNode.toString().substring('!Transform'.length))),
    };
  },
};
const fnAnd:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!And',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::And': (yaml.parse(cstNode.toString().substring('!And'.length))),
    };
  },
};
const fnEquals:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Equals',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Equals': (yaml.parse(cstNode.toString().substring('!Equals'.length))),
    };
  },
};
const fnIf:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!If',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::If': (yaml.parse(cstNode.toString().substring('!If'.length))),
    };
  },
};
const fnNot:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Not',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Not': (yaml.parse(cstNode.toString().substring('!Not'.length))),
    };
  },
};
const fnOr:yaml_types.Schema.CustomTag = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Or',
  resolve: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
    return {
      'Fn::Or': (yaml.parse(cstNode.toString().substring('!Or'.length))),
    };
  },
};
*/

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}

export function readYamlSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  yaml.defaultOptions.customTags = shortForms;
  return yaml.parse(fileContents.toString());
}
