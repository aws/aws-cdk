import * as crypto from 'crypto';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { HttpRouteIntegrationConfig } from '../../http';
import { WebSocketRouteIntegrationConfig } from '../../websocket';
import { IIntegration } from '../integration';

type IntegrationConfig = HttpRouteIntegrationConfig | WebSocketRouteIntegrationConfig;

/**
 * @internal
 */
export class IntegrationCache {
  private integrations: Record<string, IIntegration> = {};

  getSavedIntegration(scope: Construct, config: IntegrationConfig) {
    const configHash = this.getIntegrationConfigHash(scope, config);
    const integration = this.integrations[configHash];
    return { configHash, integration };
  }

  saveIntegration(scope: Construct, config: IntegrationConfig, integration: IIntegration) {
    const configHash = this.getIntegrationConfigHash(scope, config);
    this.integrations[configHash] = integration;
  }

  private getIntegrationConfigHash(scope: Construct, config: IntegrationConfig): string {
    const stringifiedConfig = JSON.stringify(Stack.of(scope).resolve(config));
    const configHash = crypto.createHash('md5').update(stringifiedConfig).digest('hex');
    return configHash;
  }
}