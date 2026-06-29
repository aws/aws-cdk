import { ComputeType } from './compute-type';

export function isLambdaComputeType(computeType: ComputeType): boolean {
  const lambdaComputeTypes = Object.values(ComputeType).filter(value => value.startsWith('BUILD_LAMBDA'));
  return lambdaComputeTypes.includes(computeType);
}
