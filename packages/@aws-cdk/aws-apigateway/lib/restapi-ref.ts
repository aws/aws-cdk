import cdk = require('@aws-cdk/cdk');

export interface RestApiRefProps {
  /**
   * The REST API ID of an existing REST API resource.
   */
  restApiId: string;
}

export abstract class RestApiRef extends cdk.Construct {

  /**
   * Imports an existing REST API resource.
   * @param parent Parent construct
   * @param id Construct ID
   * @param props Imported rest API properties
   */
  public static import(parent: cdk.Construct, id: string, props: RestApiRefProps): RestApiRef {
    return new ImportedRestApi(parent, id, props);
  }

  /**
   * The ID of this API Gateway RestApi.
   */
  public readonly abstract restApiId: string;

  /**
   * Exports a REST API resource from this stack.
   * @returns REST API props that can be imported to another stack.
   */
  public export(): RestApiRefProps {
    return {
      restApiId: new cdk.Output(this, 'RestApiId', { value: this.restApiId }).makeImportValue().toString()
    };
  }
}

class ImportedRestApi extends RestApiRef {
  public restApiId: string;

  constructor(parent: cdk.Construct, id: string, props: RestApiRefProps) {
    super(parent, id);

    this.restApiId = props.restApiId;
  }
}
