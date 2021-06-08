import { Blueprint } from '../blueprint';

export interface IDeploymentEngine {
  buildDeployment(blueprint: Blueprint): void;
}