import { Compatibility } from "./base/task-definition";

export function isEc2Compatible(comp: Compatibility) {
  return comp === Compatibility.Ec2 || comp === Compatibility.Ec2AndFargate;
}

export function isFargateCompatible(comp: Compatibility) {
  return comp === Compatibility.Fargate || comp === Compatibility.Ec2AndFargate;
}
