import * as cdk from 'aws-cdk-lib';
import * as api from 'aws-cdk-lib/cx-api';
import { StackInspector } from './inspector';
export declare function expect(stack: api.CloudFormationStackArtifact | cdk.Stack | Record<string, any>, skipValidation?: boolean): StackInspector;
