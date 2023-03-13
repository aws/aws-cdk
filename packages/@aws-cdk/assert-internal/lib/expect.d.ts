import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/cx-api';
import { StackInspector } from './inspector';
export declare function expect(stack: api.CloudFormationStackArtifact | cdk.Stack | Record<string, any>, skipValidation?: boolean): StackInspector;
