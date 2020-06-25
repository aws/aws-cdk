import * as yaml from 'yaml';

const ref = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Ref',
  resolve: (_doc: any, cstNode: any) => {
    return {
      Ref: (yaml.parse(cstNode.toString().substring('!Ref'.length))),
    };
  },
};
const base64 = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Base64',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Base64': (yaml.parse(cstNode.toString().substring('!Base64'.length))),
    };
  },
};
const cidr = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Cidr',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Cidr': (yaml.parse(cstNode.toString().substring('!Cidr'.length))),
    };
  },
};
const findInMap = {
  identify: (value: any) => typeof value === 'string',
  tag: '!FindInMap',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::FindInMap': (yaml.parse(cstNode.toString().substring('!FindInMap'.length))),
    };
  },
};
const getAtt = {
  identify: (value: any) => typeof value === 'string',
  tag: '!GetAtt',
  resolve: (_doc: any, cstNode: any) => {
    const lastDot = cstNode.toString().lastIndexOf('.');

    if (lastDot !== -1) {
      return {
        'Fn::GetAtt': [
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
const getAZs = {
  identify: (value: any) => typeof value === 'string',
  tag: '!GetAZs',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::GetAZs': (yaml.parse(cstNode.toString().substring('!GetAZs'.length))),
    };
  },
};
const importValue = {
  identify: (value: any) => typeof value === 'string',
  tag: '!ImportValue',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::ImportValue': (yaml.parse(cstNode.toString().substring('!ImportValue'.length))),
    };
  },
};
const join = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Join',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Join': (yaml.parse(cstNode.toString().substring('!Join'.length))),
    };
  },
};
const select = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Select',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Select': (yaml.parse(cstNode.toString().substring('!Select'.length))),
    };
  },
};
const split = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Split',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Split': (yaml.parse(cstNode.toString().substring('!Split'.length))),
    };
  },
};
const transform = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Transform',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Transform': (yaml.parse(cstNode.toString().substring('!Transform'.length))),
    };
  },
};
const fnAnd = {
  identify: (value: any) => typeof value === 'string',
  tag: '!And',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::And': (yaml.parse(cstNode.toString().substring('!And'.length))),
    };
  },
};
const fnEquals = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Equals',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Equals': (yaml.parse(cstNode.toString().substring('!Equals'.length))),
    };
  },
};
const fnIf = {
  identify: (value: any) => typeof value === 'string',
  tag: '!If',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::If': (yaml.parse(cstNode.toString().substring('!If'.length))),
    };
  },
};
const fnNot = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Not',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Not': (yaml.parse(cstNode.toString().substring('!Not'.length))),
    };
  },
};
const fnOr = {
  identify: (value: any) => typeof value === 'string',
  tag: '!Or',
  resolve: (_doc: any, cstNode: any) => {
    return {
      'Fn::Or': (yaml.parse(cstNode.toString().substring('!Or'.length))),
    };
  },
};

export const shortForms = [ref, base64, cidr, findInMap, getAtt, getAZs, importValue,
  join, select, split, transform, fnAnd, fnEquals, fnIf, fnNot, fnOr];
