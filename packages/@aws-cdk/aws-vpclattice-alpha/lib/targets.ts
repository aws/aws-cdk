import * as core from 'aws-cdk-lib';

import {
	aws_vpclattice,
	aws_certificatemanager as certificatemanager,
}
	from 'aws-cdk-lib';

import * as constructs from 'constructs';
import * as vpclattice from './index';

/**
 * A weighted target group adds a weighting to a target group.
 * when more than one WeightedTargetGroup is provided as the action
 * for a listener, the weights are used to determine the relative proportion
 * of traffic that is sent to the target
 */
export interface WeightedTargetGroup {
	/**
	 * A target Group
	 */
	readonly target: vpclattice.LatticeTargetGroup,
	/**
	* A weight for the target group.
	* @default 100
	*/
	readonly weight?: number | undefined
}