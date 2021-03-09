import * as crypto from 'crypto';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IIntegration } from '../common/integration';
import { HttpRouteIntegrationConfig } from '../http';
import { WebSocketRouteIntegrationConfig } from '../websocket';

type IntegrationConfig = HttpRouteIntegrationConfig | WebSocketRouteIntegrationConfig;

export class IntegrationCache {
  private integrations: Record<string, IIntegration> = {};

  getIntegration(scope: Construct, config: IntegrationConfig) {
    const configHash = this.integrationConfigHash(scope, config);
    const integration = this.integrations[configHash];
    return { configHash, integration };
  }

  saveIntegration(scope: Construct, config: IntegrationConfig, integration: IIntegration) {
    const configHash = this.integrationConfigHash(scope, config);
    this.integrations[configHash] = integration;
  }

  private integrationConfigHash(scope: Construct, config: IntegrationConfig): string {
    const stringifiedConfig = JSON.stringify(Stack.of(scope).resolve(config));
    const configHash = crypto.createHash('md5').update(stringifiedConfig).digest('hex');
    return configHash;
  }
}
