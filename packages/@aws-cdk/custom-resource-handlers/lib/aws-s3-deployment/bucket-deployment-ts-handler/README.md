# `Custom::CDKBucketDeployment` — TypeScript provider

A reimplementation of the bucket-deployment custom resource that talks to S3 and CloudFront
through the AWS SDK, replacing the Python handler that shelled out to the AWS CLI.

The specification is `BUCKET_DEPLOYMENT_CONTRACT.md` at the repository root. Its §1–§9
describe behavior callers rely on and are implemented faithfully here; its §10 catalogues
artifacts of the previous implementation, which this one is free to differ from.

## Why this exists

The CLI-based provider carried a ~10 MiB Lambda layer, could only report a subprocess exit
status when something failed, and inherited `aws s3 sync`'s file-comparison semantics —
which silently skipped same-size content changes. Those were the three most consequential
entries in `BUCKET_DEPLOYMENT_BUGS.md`.

## Layout

| File | Contents |
|------|----------|
| `index.ts` | Request dispatch, lifecycle, response assembly |
| `request.ts` | Property parsing and validation; prefix normalization |
| `s3.ts` | Staging, mirroring, pruning, recursive deletion, the ownership guard |
| `zip.ts` | Dependency-free ZIP reader and entry-path sanitization |
| `markers.ts` | Deploy-time marker substitution |
| `filters.ts` | `Exclude`/`Include` glob matching |
| `metadata.ts` | Metadata mapping and content-type guessing |
| `cloudfront.ts` | Invalidation and the completion waiter |

The ZIP reader is hand-rolled because the handler is bundled with esbuild and only
`@aws-sdk/*` is external; a ~150-line reader costs less than taking on a zip dependency for
the two compression methods the CDK asset pipeline produces.

## Deliberate behavior changes

Each fixes a defect from `BUCKET_DEPLOYMENT_BUGS.md` rather than changing the contract. All
are covered by the integration suite in
`packages/aws-cdk-lib/test-bucketdeployment/`, which passes against both implementations.

| # | Was | Now |
|---|-----|-----|
| B1 | `aws s3 sync` skipped an object whose size matched and whose timestamp was not newer, silently dropping same-size content changes | every accepted file is uploaded, so the destination always mirrors the sources |
| B2 | the destination prefix was used verbatim, so `rm --recursive` on prefix `app` also deleted `apple/` and `appendix.txt` | the prefix is normalized once, to `''` or something ending in `/` |
| B3 | any `GetBucketTagging` error was read as "not owned", so a missing permission escalated into data loss | the ownership guard fails **closed**; only `NoSuchTagSet` means "no owner" |
| B4 | the guard covered only `Delete`, so a destructive `Update` emptied a prefix another deployment owned | the guard also covers the `Update` path |
| B5/B6 | a destructive `Update` without `OldResourceProperties` returned without responding, hanging the stack | every outcome produces a response; the missing property is a request error |
| B7 | `RetainOnDelete` was compared with `== "true"` exactly, so any other spelling selected deletion | booleans parse uniformly and case-insensitively; unrecognized values take the documented default |
| B10 | `SystemMetadata` keys became CLI flags verbatim, and a value starting with `-` could inject one | keys are validated against the supported set; there is no command line |
| B11 | mismatched source lists were zipped pairwise, deploying part of the request | a length mismatch is rejected |
| B12 | `WaitForDistributionInvalidation` was truthiness-tested, so the string `"false"` meant "wait" | parsed like every other boolean |
| B14 | marker matching was line-by-line, so a marker containing a newline never matched | matching spans the whole file |
| B15 | markers were applied one after another, so a value containing another key was re-substituted | single-pass, longest-key-first |
| B17 | `OutputObjectVersionIds` with `Extract` on returned empty strings, indistinguishable from an unversioned bucket | rejected with an explanation |
| B18 | a non-string marker value crashed unless `jsonEscape` was set | non-strings are handled in both modes |
| B20 | a fresh `CallerReference` per attempt made every CloudFormation retry a new billable invalidation | derived from the request id, so retries collapse |
| B21 | a failed transfer reported only a subprocess exit status | the underlying AWS error reaches the caller |

Two further changes are not defect fixes but follow from dropping the CLI:

- **`SignContent` is accepted and has no effect.** It selected the CLI's
  `payload_signing_enabled`; the JS SDK always sends a computed `x-amz-content-sha256` for
  buffered bodies, which is the stronger of the two behaviors.
- **`sse-c-copy-source` is rejected.** It names the SSE-C algorithm of a *copy source*,
  which has no meaning on an upload, and the protocol carries no customer key. The CLI
  accepted the flag and then failed the transfer; failing up front with an explanation is
  more useful. See aws/aws-cdk#6080.

Still present, because fixing them needs a protocol change rather than an implementation
change: **B9** (`Include` always overrides an overlapping `Exclude`, because the wire format
carries two separate ordered arrays), **B13** (markers apply to every file including
binaries, since the protocol has no way to scope them), and **B19** (an invalidation is
created even by a retaining `Delete` that changed nothing, which contract §3.6 specifies).

## Tests

```bash
cd packages/@aws-cdk/custom-resource-handlers
npx jest aws-s3-deployment/bucket-deployment-ts-handler
```

`test/aws-s3-deployment/bucket-deployment-ts-handler/` holds unit tests that run against
`FakeS3` and `FakeCloudFront` — in-memory reimplementations of the operations the provider
uses, not call recorders. Tests assert on the **state of those services** afterwards, so
they describe the outcome the provider must produce and survive a change in how it gets
there. The fakes model enough real behavior to be worth trusting: `ListObjectsV2` paginates
at 1000 keys, versioned buckets keep history and accumulate delete markers,
`GetBucketTagging` raises `NoSuchTagSet` on an untagged bucket, and a CloudFront
invalidation starts `InProgress` and completes after a configurable number of polls.

Correctness against real AWS is established separately, by the integration suite:

```bash
cd packages/aws-cdk-lib
npx jest -c test-bucketdeployment/jest.config.js                      # this implementation
BD_TEST_IMPL=python npx jest -c test-bucketdeployment/jest.config.js  # the CLI one
```
