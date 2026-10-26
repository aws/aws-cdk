import type { IConstruct } from 'constructs';
import { resolveReferences, resolveReferencesInElements } from './refs';
import { CfnResource } from '../cfn-resource';
import { debugModeEnabled } from '../debug';
import { AssumptionError } from '../errors';
import type { Stack } from '../stack';
import { iterateDfsPostorder, iterateDfsPreorder } from './construct-iteration';
import type { IConsumerHostedStack } from './consumer-hosted-stack';
import { isConsumerHostedStack, templateConsumersOf, templateHostsOf, topLevelStackOf } from './consumer-hosted-stack';
import { STACK_TYPE, stageOf } from './core-construct-finders';
import { reifyConstructDependencies } from './deps';
import { lit } from './literal-string';
import { writePropertyAssignmentMetadataForConstruct } from './resolve';

function writePropertyAssignmentMetadata(root: IConstruct) {
  if (!debugModeEnabled()) return;

  const lookupTableFor = (c: CfnResource) => ({
    cfnPropertyName: (cdkPropertyName: string) => c.cfnPropertyName(cdkPropertyName),
  });

  for (const consumer of iterateDfsPreorder(root)) {
    if (CfnResource.isCfnResource(consumer)) {
      writePropertyAssignmentMetadataForConstruct(consumer, () => consumer._toCloudFormation(), lookupTableFor(consumer));
    }
  }
}

/**
 * Prepares the app for synthesis. This function is called by the root `prepare`
 * (normally this the App, but if a Stack is a root, it is called by the stack),
 * which means it's the last 'prepare' that executes.
 *
 * It takes care of reifying cross-references between stacks (or nested stacks),
 * and of creating assets for nested stack templates.
 *
 * @param root The root of the construct tree.
 */
export function prepareApp(root: IConstruct) {
  reifyConstructDependencies(root);

  resolveReferences(root);
  writePropertyAssignmentMetadata(root);

  // Stacks whose template is published as an asset, ordered so that a stack's
  // template is hashed only after the assets of all templates it embeds the URL
  // of are registered: a nested stack's template hash is reflected in its
  // parent's template, which then changes the parent's hash, etc.
  const templateProducers = findAllTemplateProducers(root);
  const nestedStacks = templateProducers.filter(s => s.nested);

  for (const producer of templateProducers) {
    if (isConsumerHostedStack(producer)) {
      defineConsumerHostedStackAsset(producer);
    } else {
      defineNestedStackAsset(producer);
    }
  }

  if (nestedStacks.length > 0) {
    // ▷[ Given the legacy synthesizer and a 3-or-deeper nesting of nested stacks ]
    //
    // Adding nested stack assets may have added CfnParameters to the top-level
    // stack which are referenced in a deeper-level stack. The values of these
    // parameters need to be carried through to the right location via Nested
    // Stack parameters, which reference resolution will do.
    //
    // Everything a nested stack asset introduces (the template URL, the stack
    // parameters and the copied tags) is consumed by that nested stack's own
    // `AWS::CloudFormation::Stack` resource, so only those resources need to be
    // revisited.
    //
    // Yes, this may add `Parameter` elements to a template whose hash has
    // already been calculated, but the invariant that if the functional part
    // of the template changes its hash will change is still upheld.
    resolveReferencesInElements(nestedStacks.map(s => s.nestedStackResource!));
  }
}

/**
 * Prepares the assets for nested stacks in this app.
 * @returns `true` if assets were added to the parent of a nested stack, which
 * implies that another round of reference resolution is in order. If this
 * function returns `false`, we know we are done.
 */
function defineNestedStackAsset(nestedStack: Stack) {
  // this is needed temporarily until we move NestedStack to '@aws-cdk/core'.
  const nested: INestedStackPrivateApi = nestedStack as any;
  nested._prepareTemplateAsset();

  // A nested stack inside a consumer-hosted stack publishes its template through
  // that stack, which copies it into every host stack. This can add constructs
  // to the hosts after references were resolved and dependencies reified, so do
  // both again for the hosts. Doing so is idempotent for what was there before.
  const topLevelStack = topLevelStackOf(nestedStack);
  if (isConsumerHostedStack(topLevelStack)) {
    for (const host of templateHostsOf(topLevelStack)) {
      reifyConstructDependencies(host);
      resolveReferences(host);
    }
  }
}

/**
 * Registers the template asset of a consumer-hosted stack in its hosts.
 */
function defineConsumerHostedStackAsset(stack: IConsumerHostedStack) {
  stack._prepareTemplateAsset();

  // The template URL of a host may reference values of another stack, such as
  // the asset parameters of a legacy synthesizer in the parent of a nested host.
  for (const consumer of templateConsumersOf(stack)) {
    resolveReferences(consumer);
  }
}

/**
 * Finds the nested and consumer-hosted stacks of this prepare root, ordered so
 * that every stack comes after the stacks whose template URL it embeds.
 */
function findAllTemplateProducers(root: IConstruct): Stack[] {
  const includeStack = (stack: IConstruct): stack is Stack => {
    if (!STACK_TYPE.isMarked(stack)) { return false; }
    if (!stack.nested && !isConsumerHostedStack(stack)) { return false; }

    // test: if we are not within a stage, then include it.
    if (!stageOf(stack)) { return true; }

    return stageOf(stack) === root;
  };

  // create a list of all such stacks in depth-first post order this means
  // that we first prepare the leaves and then work our way up.
  const postOrder = new Array<Stack>();
  for (const node of iterateDfsPostorder(root)) { /* <== important to use postorder */
    if (includeStack(node)) {
      postOrder.push(node);
    }
  }

  // The producers whose template URL each producer embeds. A nested stack's URL
  // is embedded in its parent; a consumer-hosted stack's URL in each host.
  const included = new Set(postOrder);
  const embedded = new Map<Stack, Stack[]>();
  for (const producer of postOrder) {
    const embedders = isConsumerHostedStack(producer) ? templateHostsOf(producer) : [producer.nestedStackParent!];
    for (const embedder of embedders.filter(e => included.has(e))) {
      embedded.set(embedder, [...embedded.get(embedder) ?? [], producer]);
    }
  }

  // Post order already puts nested stacks after their children, so for nested
  // stacks alone this keeps the post order.
  const result = new Set<Stack>();
  const visiting = new Set<Stack>();
  const visit = (producer: Stack) => {
    if (result.has(producer)) { return; }
    if (visiting.has(producer)) {
      throw new AssumptionError(lit`TemplateProducerCycle`, `stack '${producer.node.path}' embeds the template URL of a stack that embeds its own`);
    }
    visiting.add(producer);
    for (const child of embedded.get(producer) ?? []) {
      visit(child);
    }
    visiting.delete(producer);
    result.add(producer);
  };
  postOrder.forEach(visit);

  return Array.from(result);
}

interface INestedStackPrivateApi {
  _prepareTemplateAsset(): boolean;
}
