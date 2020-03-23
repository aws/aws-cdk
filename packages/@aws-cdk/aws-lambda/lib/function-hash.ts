import { CfnResource, Stack } from "@aws-cdk/core";
import * as crypto from 'crypto';
import { Function as LambdaFunction } from "./function";

export function calculateFunctionHash(fn: LambdaFunction) {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;

  if (!fn._codeHash) {
    throw new Error(`assertion failed: codeHash is expected to have a value if currentVersion is defined`);
  }

  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());

  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify({
    code: fn._codeHash,
    config
  }));

  return hash.digest('hex');
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}