import { Filter, PushFilter, Trigger } from '../../lib/codestar-connections/trigger';

describe('CodeStarSourceConnections Trigger Tests', () => {
  describe('Filter tests', () => {
    describe('Filter on push', () => {
      test('onTags returns expected filters when both includes and excludes are provided', () => {
        const filter = Filter.push(PushFilter.onTags({
          includes: ['tag1', 'tag2'],
          excludes: ['notThisTag', 'i-dont-know-her'],
        }));

        expect(filter._push?.tags).toEqual({ includes: ['tag1', 'tag2'], excludes: ['notThisTag', 'i-dont-know-her'] });
        expect(filter._push?.branches).toBeUndefined();
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onTags return expected filters when only includes is provided', () => {
        const filter = Filter.push(PushFilter.onTags({
          includes: ['tag1', 'tag2'],
        }));

        expect(filter._push?.tags).toEqual({ includes: ['tag1', 'tag2'] });
        expect(filter._push?.branches).toBeUndefined();
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onTags returns expected filters when only excludes are provided', () => {
        const filter = Filter.push(PushFilter.onTags({
          excludes: ['notThisTag', 'i-dont-know-her'],
        }));

        expect(filter._push?.tags).toEqual({ excludes: ['notThisTag', 'i-dont-know-her'] });
        expect(filter._push?.branches).toBeUndefined();
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onTags returns no filters when none are provided', () => {
        expect(() =>
          Filter.push(PushFilter.onTags({})),
        ).toThrow('PushFilter.onTags() must contain at least one \'includes\' or \'excludes\' pattern.');
      });

      test('onBranches returns expected filters when both includes and excludes are provided for branch filters', () => {
        const filter = Filter.push(PushFilter.onBranches({ branches: { includes: ['main'], excludes: ['release', 'test', 'idk-anything-else'] } }));

        expect(filter._push?.tags).toBeUndefined();
        expect(filter._push?.branches).toEqual({ includes: ['main'], excludes: ['release', 'test', 'idk-anything-else'] });
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onBranches returns expected filters when includes filter is provided for branch filters', () => {
        const filter = Filter.push(PushFilter.onBranches({ branches: { includes: ['main'] } }));

        expect(filter._push?.tags).toBeUndefined();
        expect(filter._push?.branches).toEqual({ includes: ['main'] });
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onBranches returns expected filters when excludes filter is provided for branch filters', () => {
        const filter = Filter.push(PushFilter.onBranches({ branches: { excludes: ['release', 'test', 'idk-anything-else'] } }));

        expect(filter._push?.tags).toBeUndefined();
        expect(filter._push?.branches).toEqual({ excludes: ['release', 'test', 'idk-anything-else'] });
        expect(filter._push?.filePaths).toBeUndefined();
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onBranches returns expected filters when filePath are included', () => {
        const filter = Filter.push(PushFilter.onBranches({ branches: { excludes: ['release', 'test', 'idk-anything-else'] }, filePaths: { includes: ['src/'] } }));

        expect(filter._push?.tags).toBeUndefined();
        expect(filter._push?.branches).toEqual({ excludes: ['release', 'test', 'idk-anything-else'] });
        expect(filter._push?.filePaths).toEqual({ includes: ['src/'] });
        expect(filter._pullRequest).toBeUndefined();
      });

      test('onBranches throws error when none are provided for branch filters', () => {

        expect(() =>
          Filter.push(PushFilter.onBranches({ branches: {} })),
        ).toThrow('PushFilter.onBranches() must contain at least one \'includes\' or \'excludes\' pattern on the \'branches\' field.');
      });
    });

    describe('Filter on pull request', () => {
      test('pullRequestEvents returns expected output when both includes and excludes are provided for branch filters', () => {
        const filter = Filter.pullRequestEvents({ branches: { includes: ['mainV1, mainV2'], excludes: ['random-other-branch'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['mainV1, mainV2'], excludes: ['random-other-branch'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'UPDATED', 'CLOSED']);
      });

      test('pullRequestEvents returns expected output when only includes filter is provided for branch filters', () => {
        const filter = Filter.pullRequestEvents({ branches: { includes: ['mainV1, mainV2'], excludes: ['random-other-branch'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['mainV1, mainV2'], excludes: ['random-other-branch'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'UPDATED', 'CLOSED']);
      });

      test('pullRequestEvents returns expected output when only excludes filter is provided for branch filters', () => {
        const filter = Filter.pullRequestEvents({ branches: { excludes: ['random-other-branch'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ excludes: ['random-other-branch'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'UPDATED', 'CLOSED']);
      });

      test('pullRequestEvents returns expected output when filepath is included', () => {
        const filter = Filter.pullRequestEvents({ branches: { excludes: ['random-other-branch'] }, filePaths: { includes: ['test/'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ excludes: ['random-other-branch'] });
        expect(filter._pullRequest?.filePaths).toEqual({ includes: ['test/'] });
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'UPDATED', 'CLOSED']);
      });

      test('pullRequestEvents throws when none are provided for branch filters', () => {
        expect(() =>
          Filter.pullRequestEvents({ branches: {} }),
        ).toThrow('Functions filtering on a pull request must contain at least one \'includes\' or \'excludes\' pattern on the \'branches\' field.');
      });

      test('pullRequestOpened returns expected events', () => {
        const filter = Filter.pullRequestOpened({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED']);
      });

      test('pullRequestUpdated returns correct events', () => {
        const filter = Filter.pullRequestUpdated({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['UPDATED']);
      });

      test('pullRequestClosed returns correct events', () => {
        const filter = Filter.pullRequestClosed({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['CLOSED']);
      });

      test('pullRequestOpenedOrUpdated returns correct events', () => {
        const filter = Filter.pullRequestOpenedOrUpdated({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'UPDATED']);
      });

      test('pullRequestOpenedOrClosed returns correct events', () => {
        const filter = Filter.pullRequestOpenedOrClosed({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['OPENED', 'CLOSED']);
      });

      test('pullRequestUpdatedOrClosed returns correct events', () => {
        const filter = Filter.pullRequestUpdatedOrClosed({ branches: { includes: ['main'] } });

        expect(filter._push).toBeUndefined();
        expect(filter._pullRequest?.branches).toEqual({ includes: ['main'] });
        expect(filter._pullRequest?.filePaths).toBeUndefined();
        expect(filter._pullRequest?.events).toEqual(['UPDATED', 'CLOSED']);
      });
    });
  });

  describe('Trigger function tests', () => {
    test('Trigger.ENABLED enables triggers with no filters', () => {
      expect(Trigger.ENABLED).toEqual({ _enabled: true, _filters: [] });
    });

    test('Trigger.DISABLED disables triggers and contains no filters', () => {
      expect(Trigger.DISABLED).toEqual({ _enabled: false, _filters: [] });
    });

    test('Trigger.withFilters() enables triggers and adds single branch filter', () => {
      expect(Trigger.withFilters(Filter.pullRequestEvents({ branches: { includes: ['main'] } }))).toEqual({
        _enabled: true,
        _filters: [{
          _pullRequest: {
            branches: {
              includes: ['main'],
            },
            events: ['OPENED', 'UPDATED', 'CLOSED'],
          },
        }],
      });
    });

    test('Trigger.withFilters() enables triggers and adds multiple types of filters', () => {
      expect(Trigger.withFilters(
        Filter.pullRequestEvents({ branches: { includes: ['main'] } }),
        Filter.push(PushFilter.onTags({ includes: ['this-one'] }),
        ))).toEqual({
        _enabled: true,
        _filters: [{
          _pullRequest: {
            branches: {
              includes: ['main'],
            },
            events: ['OPENED', 'UPDATED', 'CLOSED'],
          },
        },
        {
          _push: {
            tags: {
              includes: ['this-one'],
            },
          },
        }],
      });
    });
  });
});