import { GraphqlApiBase } from "./graphqlapi-base";
import { EventApiBase } from "./eventapi";
import { Stack, ArnFormat } from '../../core';

/**
 * A class used to generate resource arns for AppSync
 */
export class IamResource {
  /**
   * Generate the resource names given custom arns
   *
   * @param arns The custom arns that need to be permissioned
   *
   * Example: custom('/types/Query/fields/getExample')
   */
  public static custom(...arns: string[]): IamResource {
    if (arns.length === 0) {
      throw new Error('At least 1 custom ARN must be provided.');
    }
    return new IamResource(arns);
  }

  /**
   * Generate the resource names given a type and fields
   *
   * @param type The type that needs to be allowed
   * @param fields The fields that need to be allowed, if empty grant permissions to ALL fields
   *
   * Example: ofType('Query', 'GetExample')
   */
  public static ofType(type: string, ...fields: string[]): IamResource {
    const arns = fields.length ? fields.map((field) => `types/${type}/fields/${field}`) : [`types/${type}/*`];
    return new IamResource(arns);
  }

  /**
   * Generate the resource names that accepts all types: `*`
   */
  public static all(): IamResource {
    return new IamResource(['*']);
  }

  private arns: string[];

  private constructor(arns: string[]) {
    this.arns = arns;
  }

  /**
   * Return the Resource ARN
   *
   * @param api The AppSync API to give permissions
   */
  public resourceArns(api: GraphqlApiBase | EventApiBase ): string[] {
    return this.arns.map((arn) =>
      Stack.of(api).formatArn({
        service: 'appsync',
        resource: `apis/${api.apiId}`,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        resourceName: `${arn}`,
      }),
    );
  }
}