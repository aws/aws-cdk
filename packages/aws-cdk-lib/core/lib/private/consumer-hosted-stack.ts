import type { IConstruct } from 'constructs';
import { stackOf } from './core-construct-finders';
import type { Stack } from '../stack';

/**
 * Private API of a stack whose template is not deployed as an artifact of its
 * own or as an asset of its parent stack. Instead, every stack that consumes the
 * template hosts its own copy of it as a file asset.
 */
export interface IConsumerHostedStack extends Stack {
  /**
   * Register the template as a file asset of every stack that hosts it.
   *
   * Called during prepare, after references are resolved and after the
   * templates of the nested stacks inside this stack were registered. Calls
   * after the first one must not register anything.
   */
  _prepareTemplateAsset(): void;
}

const CONSUMER_HOSTED_STACK = Symbol.for('@aws-cdk/core.ConsumerHostedStack');
const TEMPLATE_CONSUMERS = Symbol.for('@aws-cdk/core.ConsumerHostedStack.consumers');
const HOSTED_STACKS = Symbol.for('@aws-cdk/core.ConsumerHostedStack.hostedStacks');

/**
 * Mark a stack as one whose template is hosted by the stacks that consume it.
 */
export function markConsumerHostedStack(stack: IConsumerHostedStack): void {
  Object.defineProperty(stack, CONSUMER_HOSTED_STACK, { value: true });
  Object.defineProperty(stack, TEMPLATE_CONSUMERS, { value: new Array<IConstruct>() });
}

export function isConsumerHostedStack(x: unknown): x is IConsumerHostedStack {
  return x !== null && typeof x === 'object' && CONSUMER_HOSTED_STACK in x;
}

/**
 * Record that `consumer` uses the template of `stack`, so the stack of `consumer` hosts it.
 */
export function addTemplateConsumer(stack: IConsumerHostedStack, consumer: IConstruct): void {
  templateConsumersOf(stack).push(consumer);

  const host = stackOf(consumer);
  if (!(HOSTED_STACKS in host)) {
    Object.defineProperty(host, HOSTED_STACKS, { value: new Array<IConsumerHostedStack>() });
  }
  const hosted: IConsumerHostedStack[] = (host as any)[HOSTED_STACKS];
  if (!hosted.includes(stack)) {
    hosted.push(stack);
  }
}

/**
 * The constructs that use the template of `stack`, in the order they were added.
 */
export function templateConsumersOf(stack: IConsumerHostedStack): IConstruct[] {
  return (stack as any)[TEMPLATE_CONSUMERS];
}

/**
 * The stacks that host the template of `stack`, in the order they were added.
 */
export function templateHostsOf(stack: IConsumerHostedStack): Stack[] {
  return Array.from(new Set(templateConsumersOf(stack).map(stackOf)));
}

/**
 * The consumer-hosted stacks whose template `host` hosts.
 */
export function stacksHostedBy(host: Stack): readonly IConsumerHostedStack[] {
  return (host as any)[HOSTED_STACKS] ?? [];
}

/**
 * The top-level stack of `stack`: `stack` itself, or the top-level stack a nested stack is in.
 */
export function topLevelStackOf(stack: Stack): Stack {
  let current = stack;
  while (current.nestedStackParent) {
    current = current.nestedStackParent;
  }
  return current;
}
