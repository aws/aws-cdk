// These functions defined at 'aws-cdk-lib/custom-resources'.
// However, 'aws-cdk-lib/custom-resources' exports the some constructs,
// so when import the package, then bundle size is too large and lambda function is not working.
// To avoid this issue, we using inject of esbuild (https://esbuild.github.io/api/#inject)
export declare const getV3ClientPackageName: (clientName: string) => string;
export declare const findV3ClientConstructor: (pkg: Object) => new (config: any) => {
  send: (command: any) => Promise<any>;
  config: any;
};