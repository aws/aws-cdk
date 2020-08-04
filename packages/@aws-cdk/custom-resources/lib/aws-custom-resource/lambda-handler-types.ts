import { AwsSdkCall } from './aws-custom-resource';

export type EncodedAwsSdkCall = Omit<AwsSdkCall, 'assumedRole'> & {
  readonly assumedRole?: string;
};
