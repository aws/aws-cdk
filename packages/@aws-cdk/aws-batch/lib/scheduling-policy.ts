import { Duration, IResource, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';


export interface ISchedulingPolicy extends IResource {
  name?: string
}

interface SchedulingPolicyProps extends ResourceProps {
  name?: string;
}

class SchedulingPolicyBase extends Resource implements ISchedulingPolicy {
  name?: string;

  constructor(scope: Construct, id: string, props?: SchedulingPolicyProps) {
    super(scope, id, props);

    this.name = props?.name;
  }
}

export interface Share {
  /**
   * The identifier of this Share. All jobs that specify this share identifier
   * when submitted to the queue will be considered as part of this Share.
   */
  shareIdentifier: string;

  /**
   * The weight factor given to this Share. The Scheduler decides which jobs to put in the Compute Environment
   * such that the following ratio is equal for each job:
   *
   * `sharevCpu / weightFactor`,
   *
   * where `sharevCpu` is the total amount of vCPU given to that particular share; that is,
   * the sum of the vCPU each job currently in the Compute Environment for that share.
   *
   * See the readme of this module for a detailed example that shows how these are used,
   * how it relates to `computeReservation`, and how `shareDecay` affects these calculations.
   */
  weightFactor: number;
}

export interface IFairshareSchedulingPolicy extends ISchedulingPolicy {
  /**
   * Used to calculate the percentage of the maximum available vCPU to reserve for share identifiers not present in the Queue.
   *
   * The percentage reserved is defined by the Scheduler as:
   * `(computeReservation/100)^ActiveFairShares` where `ActiveFairShares` is the number of active fair share identifiers.
   *
   * For example, a computeReservation value of 50 indicates that AWS Batch reserves 50% of the
   * maximum available vCPU if there's only one fair share identifier.
   * It reserves 25% if there are two fair share identifiers.
   * It reserves 12.5% if there are three fair share identifiers.
   *
   * A computeReservation value of 25 indicates that AWS Batch should reserve 25% of the
   * maximum available vCPU if there's only one fair share identifier,
   * 6.25% if there are two fair share identifiers,
   * and 1.56% if there are three fair share identifiers.
   *
   * @default - no vCPU is reserved
   */
  readonly computeReservation?: number;

  /**
   * The amount of time to use to measure the usage of each job.
   * The usage is used to calculate a fair share percentage for each fair share identifier currently in the Queue.
   * A value of zero (0) indicates that only current usage is measured.
   * The decay is linear and gives preference to newer jobs.
   *
   * The maximum supported value is 604800 seconds (1 week).
   */
  readonly shareDecay?: Duration;

  /**
   * The shares that this Scheduling Policy applies to.
   * *Note*: It is possible to submit Jobs to the queue with Share Identifiers that
   * are not recognized by the Scheduling Policy.
   */
  readonly shares?: Share[];
}

export interface FairshareSchedulingPolicyProps extends SchedulingPolicyProps {
  /**
   * Used to calculate the percentage of the maximum available vCPU to reserve for share identifiers not present in the Queue.
   *
   * The percentage reserved is defined by the Scheduler as:
   * `(computeReservation/100)^ActiveFairShares` where `ActiveFairShares` is the number of active fair share identifiers.
   *
   * For example, a computeReservation value of 50 indicates that AWS Batch reserves 50% of the
   * maximum available vCPU if there's only one fair share identifier.
   * It reserves 25% if there are two fair share identifiers.
   * It reserves 12.5% if there are three fair share identifiers.
   *
   * A computeReservation value of 25 indicates that AWS Batch should reserve 25% of the
   * maximum available vCPU if there's only one fair share identifier,
   * 6.25% if there are two fair share identifiers,
   * and 1.56% if there are three fair share identifiers.
   *
   * @default - no vCPU is reserved
   */
  readonly computeReservation?: number;

  /**
   * The amount of time to use to measure the usage of each job.
   * The usage is used to calculate a fair share percentage for each fair share identifier currently in the Queue.
   * A value of zero (0) indicates that only current usage is measured.
   * The decay is linear and gives preference to newer jobs.
   *
   * The maximum supported value is 604800 seconds (1 week).
   */
  readonly shareDecay?: Duration;

  /**
   * The shares that this Scheduling Policy applies to.
   * *Note*: It is possible to submit Jobs to the queue with Share Identifiers that
   * are not recognized by the Scheduling Policy.
   */
  readonly shares?: Share[];
}

export class FairshareSchedulingPolicy extends SchedulingPolicyBase implements IFairshareSchedulingPolicy {
  /**
   * Used to calculate the percentage of the maximum available vCPU to reserve for share identifiers not present in the Queue.
   *
   * The percentage reserved is defined by the Scheduler as:
   * `(computeReservation/100)^ActiveFairShares` where `ActiveFairShares` is the number of active fair share identifiers.
   *
   * For example, a computeReservation value of 50 indicates that AWS Batch reserves 50% of the
   * maximum available vCPU if there's only one fair share identifier.
   * It reserves 25% if there are two fair share identifiers.
   * It reserves 12.5% if there are three fair share identifiers.
   *
   * A computeReservation value of 25 indicates that AWS Batch should reserve 25% of the
   * maximum available vCPU if there's only one fair share identifier,
   * 6.25% if there are two fair share identifiers,
   * and 1.56% if there are three fair share identifiers.
   *
   * @default - no vCPU is reserved
   */
  readonly computeReservation?: number;

  /**
   * The amount of time to use to measure the usage of each job.
   * The usage is used to calculate a fair share percentage for each fair share identifier currently in the Queue.
   * A value of zero (0) indicates that only current usage is measured.
   * The decay is linear and gives preference to newer jobs.
   *
   * The maximum supported value is 604800 seconds (1 week).
   */
  readonly shareDecay?: Duration;

  /**
   * The shares that this Scheduling Policy applies to.
   * *Note*: It is possible to submit Jobs to the queue with Share Identifiers that
   * are not recognized by the Scheduling Policy.
   */
  readonly shares?: Share[];

  constructor(scope: Construct, id: string, props?: FairshareSchedulingPolicyProps) {
    super(scope, id, props);
    this.computeReservation = props?.computeReservation;
    this.shareDecay = props?.shareDecay;
    this.shares = props?.shares;
  }
}
