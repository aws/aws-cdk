import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import yaml = require('yaml');
import { BootstrapPipeline, BootstrapPipelineProps } from './pipeline';

const config = readConfig();
const app = new cdk.App();

for (const [ id, props ] of Object.entries(config)) {
  const stack = new cdk.Stack(app, `cdk-bootstrap-${id}`);
  new BootstrapPipeline(stack, id, props);
}

interface Config {
  [name: string]: BootstrapPipelineProps
}

function readConfig(): Config {
  const files = [
    'cdk.pipelines.yaml',
    'cdk.pipelines.json'
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      return yaml.parse((fs.readFileSync(file, 'utf-8')));
    }
  }

  throw new Error(`Unable to find pipeline configuration in one of: ${files.join(', ')}`);
}
