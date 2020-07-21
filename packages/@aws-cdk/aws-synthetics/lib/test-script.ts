import { Code } from './code';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';

export class Test {
  /**
   * @returns `CustomTest` associated with the specified Code object
   * @param code The script you want the canary to run
   * @param handler The handler of the code
   */
  public static custom(scope: Construct, options: CustomOptions): Test {
    const codeConfig = options.code.bind(scope);
    return new Test({
      handler: options.handler,
      inlineCode: codeConfig.inlineCode,
      s3Location: codeConfig.s3Location,
    });
  }

  /**
   * TODO
   */
  //public static heartBeat(url: string){}

  /**
   * TODO
   */
  //public static apiEndpoint(url: string, options: apiOptions){}

  /**
   * TODO
   */
  //public static brokenLink(url: string, options: linkOptions){}

  private constructor(public readonly config: TestConfig){}
}

export interface TestConfig {
  /**
   * The location of the code in S3 (mutually exclusive with `inlineCode`).
   */
  readonly s3Location?: s3.Location;

  /**
   * Inline code (mutually exclusive with `s3Location`).
   */
  readonly inlineCode?: string;

  /**
   * The handler of the code
   */
  readonly handler: string;
}

// export class CustomTest extends Test {
//   constructor(public readonly code: Code, public readonly handler: string){
//     super();

//   }


// }

export interface CustomOptions {
  code: Code,
  handler: string,
}