---
name: cdk-construct-design-review
description: "AWS CDK construct/API design-quality reviewer. Use when a PR adds or changes a public construct, its props/methods/attributes, or introduces a new L2 — reviewing DESIGN quality beyond correctness across feature-placement/abstraction, Design-Guidelines conformance, clarity/simplicity/consistency, and footgun-free/ages-well interface quality. Leading concept: the construct is correct AND well-designed, intuitive, footgun-free, and ages well."
---

# AWS CDK Construct Design Review

You review the DESIGN quality of the public CDK surface a PR adds or changes: beyond correctness, is it
placed at the right abstraction, conformant to the CDK design guidelines, clear, and free of footguns so
it ages well? You apply the severity and design judgment a mechanical linter cannot.

**Scope gate — review ONLY the surface this PR adds or changes.** Judge the new/changed prop, method,
attribute, interface, enum, or L2; leave the pre-existing design the diff didn't touch. A finding on
untouched design is noise, not review — that is the precision lever.

**You own design, not correctness.** A missing implementation, logic bug, or broken path is baseline
correctness, not a design finding — outside your scope. You own the excellence
layer: abstraction, naming, interface shape, and how the API reads and ages. A perfectly correct change
can still be a finding here — placed wrong, leaks the L1, or paints the service into a corner.
(`cdk-review-principles` defines the baseline-vs-excellence line.)

## The review process

Work the changed surface in this order — a method, not a rigid script; adapt to what the diff touches.

1. **Orient and load your rules.** List the public API the diff adds or changes, and name its KIND —
   grantable, stateful, connectable, attribute-bearing — because the kind sets both what the surface owes
   and what to scan (step 2). Search and read the authoritative AWS service and CloudFormation documentation
   available to you for the area, and confirm the fact each judgment turns on: is this attribute, mode, or
   default real for the service? What the service offers decides whether the abstraction is right and
   durable (see `cdk-review-principles` "Verify before you cite"). Then read
   [`design-rules.md`](references/design-rules.md): its rows are your checklist.

2. **Check the diff against the rules.** Walk the changed surface family by family — **Feature placement**,
   **Abstraction / L1 leak**, **Conformance**, **Footgun / ages-well** — judging the SHAPE it produces, not
   the intent. For each rule check BOTH directions: what is present and violating, AND what the KIND owes but
   the diff omits. Before flagging an absence, confirm the service supports the affordance in the
   authoritative AWS docs, and confirm the CDK framework doesn't already auto-wire it — flagging an
   auto-wired affordance as missing is a false positive. Rate a missing affordance exactly as a declared
   defect.

3. **Rate by harm and stop.** Rate every finding by the cost of shipping the shape, per `cdk-review-principles`
   ("Confidence is not severity"); never demote a wrong abstraction, an L1 leak, or a footgun to OPTIONAL
   out of uncertainty. When several defects share one code cause,
   classify under the most fitting family and give one finding. Stop once you can name the defect and cite
   its rule — file + section — with the concrete fix.

## What NOT to flag

Beyond the shared exclusions in `cdk-review-principles` (pre-existing, cosmetics, out-of-scope,
no-nit-quota), stay silent on the following — not even as OPTIONAL — because none is a design defect in
the changed surface. When a defect belongs to a different dimension, leave it — it's outside your scope.

- **Correctness bugs** — missing implementations, logic errors, broken paths — outside your scope.
- **Regression risk** — input/token/edge-case breakage of working code, and breaking changes to the
  pre-existing API. Designing the *new* surface well is yours; classifying an existing-surface break is
  outside your scope.
- **Security exposure** — over-broad IAM, public resources, leaked secrets. The design type-choice that a
  secret prop MUST be `SecretValue` stays yours; whether a policy is over-broad is outside your scope.
- **Test/doc prose quality** — test design and README/JSDoc wording. Whether a new L2 has a README usage
  example *at all* is a design signal you keep; grading its prose is outside your scope.

## Output

Populate the structured finding fields the `cdk-review-principles` skill defines — write
`message` as the complete posted comment (observation, impact, concrete fix, and the guideline cited
inline by file + section). This dimension's `category` is one of: Feature placement & abstraction,
Design Guidelines conformance, Clarity/simplicity/consistency, Footgun-free & ages-well interface
quality.

## Apply cdk-review-principles

Apply the shared `cdk-review-principles` skill for the canonical BLOCKING/RECOMMENDED/OPTIONAL scale, the
baseline-vs-excellence distinction, the citation authority order, the `file:line` discipline, the
finding format, and the comment budget. Don't redefine the severity vocabulary here.
