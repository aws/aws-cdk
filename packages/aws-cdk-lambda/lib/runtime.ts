/**
 * Lambda function runtime environment.
 */
export enum LambdaRuntime {
    NodeJS = 'nodejs',
    NodeJS43 = 'nodejs4.3',
    NodeJS43Edge = 'nodejs4.3-edge',
    NodeJS610 = 'nodejs6.10',
    Java8 = 'java8',
    Python27 = 'python2.7',
    Python36 = 'python3.6',
    DotNetCore1 = 'dotnetcore1.0',
    DotNetCore2 = 'dotnetcore2.0',
    Go1x = 'go1.x'
}
