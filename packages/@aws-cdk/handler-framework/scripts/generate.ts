import * as path from 'path';
import { ComponentDefinition, ComponentType, config } from '../lib/config';
import { CdkHandlerFramework } from '../lib/framework';

/* eslint-disable no-console */

const componentDefinitions: ComponentDefinition[] = [];

function main() {
  recurse(config);
  for (const component of componentDefinitions) {
    generateFrameworkComponent(component);
  }

  function recurse(_config: any) {
    if (_config instanceof Array) {
      componentDefinitions.push(..._config);
      return;
    }
    for (const key in _config) {
      if (_config.hasOwnProperty(key) && typeof _config[key] === 'object') {
        recurse(_config[key]);
      }
    }
  }
}

function generateFrameworkComponent(component: ComponentDefinition) {
  switch (component.type) {
    case ComponentType.CDK_FUNCTION: {
      CdkHandlerFramework.generateCdkFunction({
        outputFileLocation: path.join(__dirname),
        className: component.name,
        codeDirectory: component.codeDirectory,
        entrypoint: component.entrypoint,
      });
      return;
    }
    case ComponentType.CDK_SINGLETON_FUNCTION: {
      return;
    }
    case ComponentType.CDK_CUSTOM_RESOURCE_PROVIDER: {
      return;
    }
  }
}

main();
