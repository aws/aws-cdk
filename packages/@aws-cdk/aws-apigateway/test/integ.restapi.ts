import cdk = require('@aws-cdk/cdk');
import apigateway = require('../lib');

class Test extends cdk.Stack {
    constructor(parent: cdk.App, id: string) {
        super(parent, id);

        const api = new apigateway.RestApi(this, 'my-api', {
            minimumCompressionSize: 0,
            autoDeployStageOptions: {
                stageName: 'test',
                description: 'testing stage'
            }
        });

        const v1 = api.newResource('api');

        const toys = v1.newResource('toys');
        toys.newMethod('GET');
        toys.newMethod('POST');
        toys.newMethod('PUT');

        const appliances = v1.newResource('appliances');
        appliances.newMethod('GET');

        const books = v1.newResource('books');
        books.newMethod('GET');
        books.newMethod('POST');
    }
}

const app = new cdk.App(process.argv);

new Test(app, 'test-apigateway-restapi');

process.stdout.write(app.run());