import * as cdk from '@aws-cdk/core';

// This file contains utility functions used in the implementation of ExampleResource
// which we don't want to make part of the public API of this module
// (in fact, we can't, as JSII does not work for standalone functions!).
// So, while the functions are exported from this file,
// this file is not listed in index.ts,
// and so these functions are effectively 'module-private'.
// To make it clear that this file should not be exported,
// we place it in a subdirectory of lib called 'private'.

export function exampleResourceArnComponents(exampleResourceName: string): cdk.ArnComponents {
  return {
    service: 'cloudformation',
    resource: 'wait-condition',
    resourceName: exampleResourceName,
  };
}
