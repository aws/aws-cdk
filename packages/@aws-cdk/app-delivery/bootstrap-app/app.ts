import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import yaml = require('yaml');
import { BootstrapPipeline, BootstrapPipelineProps } from './constructs';

const config = readConfig();
const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-pipelines');

for (const [ id, props ] of Object.entries(config)) {
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
