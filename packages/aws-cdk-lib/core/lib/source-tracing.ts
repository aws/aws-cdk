import type { Node } from 'constructs';
import { debugModeEnabled } from './debug';

export function traceProperty(node: Node, propertyName: string) {
  if (debugModeEnabled()) {
    node.addMetadata('aws:cdk:propertyName', propertyName, {
      stackTrace: true,
      traceFromFunction: traceProperty,
    });
  }
}
