import { Construct, IConstruct } from './construct';

/**
 * Interface for the Resource construct.
 */
// tslint:disable-next-line:no-empty-interface
export interface IResource extends IConstruct {

}

/**
 * A construct which represents an AWS resource.
 */
export abstract class Resource extends Construct implements IResource {

}
