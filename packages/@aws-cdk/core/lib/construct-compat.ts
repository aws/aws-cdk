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
