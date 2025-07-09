import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { JsonMutatorType, LogGroup, ParserProcessorType, ParserProcessor, JsonMutatorProcessor } from 'aws-cdk-lib/aws-logs';

class TransformerIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'MyLogGroup');
    const jsonParser = new ParserProcessor({
      type: ParserProcessorType.JSON,
      jsonOptions: { source: 'customField' },
    });

    const addKeysProcesor = new JsonMutatorProcessor({
      type: JsonMutatorType.ADD_KEYS,
      addKeysOptions: {
        entries: [
          { key: 'test_key1', value: 'test_value1', overwriteIfExists: true },
          { key: 'test_key2', value: 'test_value2' },
          { key: 'test_key3', value: 'test_value3', overwriteIfExists: false },
        ],
      },
    });

    logGroup.addTransformer('Transformer', {
      transformerName: 'MyTransformer',
      transformerConfig: [jsonParser, addKeysProcesor],
    });
  }
}

const app = new App();
const testCase = new TransformerIntegStack(app, 'aws-cdk-transformer-integ');
new IntegTest(app, 'transformer-create', {
  testCases: [testCase],
});
