/**
 * Turn CloudFormation intrinsics into strings
 *
 * ------
 *
 * This stringification is not intended to be mechanically reversible! It's intended
 * to be understood by humans!
 *
 * ------
 *
 * Turns Fn::GetAtt and Fn::Ref objects into the same strings that can be
 * parsed by Fn::Sub, but without the surrounding intrinsics.
 *
 * Evaluates Fn::Join directly if the second argument is a literal list of strings.
 *
 * Removes list and object values evaluating to { Ref: 'AWS::NoValue' }.
 *
 * For other intrinsics we choose a string representation that CloudFormation
 * cannot actually parse, but is comprehensible to humans.
 */
export function renderIntrinsics(x: any): any {
  if (Array.isArray(x)) {
    return x.filter(el => !isNoValue(el)).map(renderIntrinsics);
  }

  if (isNoValue(x)) { return undefined; }

  const intrinsic = getIntrinsic(x);
  if (intrinsic) {
    if (intrinsic.fn === 'Ref') { return '${' + intrinsic.args + '}'; }
    if (intrinsic.fn === 'Fn::GetAtt') { return '${' + intrinsic.args[0] + '.' + intrinsic.args[1] + '}'; }
    if (intrinsic.fn === 'Fn::Join') { return unCloudFormationFnJoin(intrinsic.args[0], intrinsic.args[1]); }
    return stringifyIntrinsic(intrinsic.fn, intrinsic.args);
  }

  if (typeof x === 'object' && x !== null) {
    const ret: any = {};
    for (const [key, value] of Object.entries(x)) {
      if (!isNoValue(value)) {
        ret[key] = renderIntrinsics(value);
      }
    }
    return ret;
  }
  return x;
}

function unCloudFormationFnJoin(separator: string, args: any) {
  if (Array.isArray(args)) {
    return args.filter(el => !isNoValue(el)).map(renderIntrinsics).join(separator);
  }
  return stringifyIntrinsic('Fn::Join', [separator, args]);
}

function stringifyIntrinsic(fn: string, args: any) {
  return JSON.stringify({ [fn]: renderIntrinsics(args) });
}

function getIntrinsic(x: any): Intrinsic | undefined {
  if (x === undefined || x === null || Array.isArray(x)) { return undefined; }
  if (typeof x !== 'object') { return undefined; }
  const keys = Object.keys(x);
  return keys.length === 1 && (keys[0] === 'Ref' || keys[0].startsWith('Fn::')) ? { fn: keys[0], args: x[keys[0]] } : undefined;
}

function isNoValue(x: any) {
  const int = getIntrinsic(x);
  return int && int.fn === 'Ref' && int.args === 'AWS::NoValue';
}

interface Intrinsic {
  fn: string;
  args: any;
}
