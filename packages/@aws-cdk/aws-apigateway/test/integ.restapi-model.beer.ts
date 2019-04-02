import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigw = require('../lib');
import { JsonSchemaSchema, MethodResponse } from '../lib';

class BeerApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Lambda handler
    const beersHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BeersHandler', {
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${getAllTheBeersHandler}`)
    }));

    const beerHandler = new apigw.LambdaIntegration(new lambda.Function(this, 'BeerHandler', {
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(`exports.handler = ${getTheOneBeerHandler}`)
    }));

    // API + resource
    const api = new apigw.RestApi(this, 'beer-api');

    // Models
    const beerSummaryModel = api.addModel('BeerSummary', {
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaSchema.draft4,
        title: 'BeerSummary',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
      description: 'A basic summary for a beer. Used for listing a bunch of beers at a glance.'
    });

    const breweryModel = api.addModel('Brewery', {
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaSchema.draft4,
        title: 'Brewery',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          address: { type: 'string' },
          beers: { type: 'array', items: { ref: beerSummaryModel.referenceForSchema } },
        },
      },
      description: 'Models a brewery.',
    });

    const beerDetailsModel = api.addModel('BeerDetails', {
      contentType: 'application/json',
      schema: {
        schema: JsonSchemaSchema.draft4,
        title: 'Beer',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          brewery: { type: 'object', ref: breweryModel.referenceForSchema },
          style: { type: 'string' },
          abv: { type: 'number' },
          ibu: { type: 'number' },
        },
      },
      description: 'Models details of an individual beer.',
    });

    // Resources and methods
    const resourceBeers = api.root.addResource('beer');
    resourceBeers.addMethod('GET', beersHandler, {
      methodResponses: [
        new MethodResponse({ statusCode: '200' })
          .addResponseModel(beerSummaryModel)
      ]
    });

    const resourceBeer = resourceBeers.addResource('{beer_id}');
    resourceBeer.addMethod('GET', beerHandler, {
      methodResponses: [
        new MethodResponse({ statusCode: '200' })
          .addResponseModel(beerDetailsModel)
      ]
    });
  }
}

class BeerApp extends cdk.App {
  constructor() {
    super();

    new BeerApiStack(this, 'restapi-model-beer-example');
  }
}

function getAllTheBeersHandler(_event: any, _: any, callback: any) {
  callback(undefined, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify([{
      id: '42095j23095u390j330r93',
      name: 'Duff',
    }]),
  });
}

function getTheOneBeerHandler(_event: any, _: any, callback: any) {
  callback(undefined, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: '42095j23095u390j330r93',
      name: 'Duff',
      brewery: 'Duff Brewing Company',
      style: 'American Adjunct Lager',
      abv: 4.5,
      ibu: 25,
    }),
  });
}

new BeerApp().run();