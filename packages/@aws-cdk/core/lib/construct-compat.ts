/**
 * Constructs compatibility layer.
 *
 * This file contains typescript aliases for types in "constructs" as part of
 * our migration to 2.x and in order to reduce the chance for merge conflicts as
 * we transition from the code base of 1.x to 2.x
 */

// /**
//  * Represents the building block of the construct graph.
//  *
//  * All constructs besides the root construct must be created within the scope of
//  * another construct.
//  */
// export class Construct extends constructs.Construct implements IConstruct {
//   /**
//    * Return whether the given object is a Construct
//    */
//   public static isConstruct(x: any): x is Construct {
//     return typeof x === 'object' && x !== null && CONSTRUCT_SYMBOL in x;
//   }

import * as constructs from 'constructs';

export type Construct = constructs.Construct;
export type IConstruct = constructs.IConstruct;
export type ConstructOrder = constructs.ConstructOrder;

export type DependableTrait = constructs.Dependable;
export type IDependable = constructs.IDependable;
export type ConstructNode = constructs.Node;
export type ConcreteDependable = constructs.DependencyGroup;
