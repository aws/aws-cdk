import cdk = require('@aws-cdk/cdk');
import { RestApiId } from './apigateway.generated';

export interface RestApiRefProps {
    restApiId: RestApiId;
}

export abstract class RestApiRef extends cdk.Construct {
    public static import(parent: cdk.Construct, id: string, props: RestApiRefProps) {
        return new ImportedRestApi(parent, id, props);
    }

    /**
     * The ID of this API Gateway RestApi.
     */
    public abstract restApiId: RestApiId;

    public export(): RestApiRefProps {
        return {
            restApiId: new RestApiId(new cdk.Output(this, 'RestApiId', { value: this.restApiId }).makeImportValue()),
        };
    }
}

class ImportedRestApi extends RestApiRef {
    public restApiId: RestApiId;

    constructor(parent: cdk.Construct, id: string, props: RestApiRefProps) {
        super(parent, id);

        this.restApiId = props.restApiId;
    }
}
