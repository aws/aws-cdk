import { Construct } from 'constructs';
import { Blueprint } from '../blueprint';

export interface IDeploymentEngine {
  buildDeployment(options: BuildDeploymentOptions): void;
}

export interface BuildDeploymentOptions {
  readonly scope: Construct;
  readonly blueprint: Blueprint;
}