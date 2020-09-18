import * as fs from 'fs';
import * as yaml from 'yaml';
import * as yaml_cst from 'yaml/parse-cst';
import * as yaml_types from 'yaml/types';

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}

export function readYamlSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return parseYamlStrWithCfnTags(fileContents.toString());
}

function makeTagForCfnIntrinsic(
  intrinsicName: string, addFnPrefix: boolean = true,
  resolveFun?: (_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => any): yaml_types.Schema.CustomTag {

  return {
    identify(value: any) { return typeof value === 'string'; },
    tag: `!${intrinsicName}`,
    resolve: resolveFun || ((_doc: yaml.Document, cstNode: yaml_cst.CST.Node) => {
      const ret: any = {};
      ret[addFnPrefix ? `Fn::${intrinsicName}` : intrinsicName] =
        // the +1 is to account for the ! the short form begins with
        parseYamlStrWithCfnTags(cstNode.toString().substring(intrinsicName.length + 1));
      return ret;
    }),
  };
}

const shortForms: yaml_types.Schema.CustomTag[] = [
  'Base64', 'Cidr', 'FindInMap', 'GetAZs', 'ImportValue', 'Join', 'Sub',
  'Select', 'Split', 'Transform', 'And', 'Equals', 'If', 'Not', 'Or',
].map(name => makeTagForCfnIntrinsic(name)).concat(
  makeTagForCfnIntrinsic('Ref', false),
  makeTagForCfnIntrinsic('Condition', false),
  makeTagForCfnIntrinsic('GetAtt', true, (_doc: yaml.Document, cstNode: yaml_cst.CST.Node): any => {
    const parsedArguments = parseYamlStrWithCfnTags(cstNode.toString().substring('!GetAtt'.length));

    let value: any;
    if (typeof parsedArguments === 'string') {
      // if the arguments to !GetAtt are a string,
      // the part before the first '.' is the logical ID,
      // and the rest is the attribute name
      // (which can contain '.')
      const firstDot = parsedArguments.indexOf('.');
      if (firstDot === -1) {
        throw new Error(`Short-form Fn::GetAtt must contain a '.' in its string argument, got: '${parsedArguments}'`);
      }
      value = [
        parsedArguments.substring(0, firstDot),
        parsedArguments.substring(firstDot + 1), // the + 1 is to skip the actual '.'
      ];
    } else {
      // this is the form where the arguments to Fn::GetAtt are already an array -
      // in this case, nothing more to do
      value = parsedArguments;
    }

    return { 'Fn::GetAtt': value };
  }),
);

function parseYamlStrWithCfnTags(text: string): any {
  return yaml.parse(text, {
    customTags: shortForms,
    schema: 'yaml-1.1',
  });
}
