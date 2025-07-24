import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { LogGroup, ParserProcessorType, ParserProcessor, Transformer } from 'aws-cdk-lib/aws-logs';

class TransformerIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'MyLogGroup');
    const jsonParser = new ParserProcessor({
      type: ParserProcessorType.JSON,
      jsonOptions: { source: 'customField' },
    });

    new Transformer(this, 'Transformer', {
      transformerName: 'MyTransformer',
      logGroup: logGroup,
      transformerConfig: [jsonParser],
    });
  }
}

const app = new App();
const testCase = new TransformerIntegStack(app, 'aws-cdk-transformer-integ');
new IntegTest(app, 'transformer-create', {
  testCases: [testCase],
});
