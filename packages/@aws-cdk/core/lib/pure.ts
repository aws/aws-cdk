import { App } from './app';
import { Construct } from './construct';
import { Stack } from './stack';

/**
 * The namespace provides utilities to abstract Infrastructure as a Code
 * in terms of pure functions and solve embarrassingly obvious composition problem.
 */
export namespace pure {

  /**
   * abstract definition of IaaC code block
   */
  export type IaaC<T> = (node: Construct) => T;

  /**
   * lifts pure functional IaaC blocks to CDK nodes, attaches them to
   * parent node. The node's logical name is a function name
   * @param node a parent node to attach IaaC blocks
   * @param fns list of IaaC blocks
   */
  export function join<T>(node: Construct, ...fns: Array<IaaC<T>>): Construct {
    fns.forEach(
      fn => {
      node instanceof App
        ? fn(new Stack(node, fn.name))
        : fn(new Construct(node, fn.name));
      }
    );
    return node;
  }

  /**
   * lifts pure functional IaaC blocks to Stack node, then attaches then it to application.
   * The node's logical name is either name of function or given name
   * @param node
   * @param fn
   * @param name
   */
  export function add<T>(node: App, fn: IaaC<T>, name?: string): Construct {
    fn(new Stack(node, name || fn.name));
    return node;
  }
}
