/**
 * Snapshot tests to assert that the rendering styles of the deep mismatch rendering make sense
 */

import { Matcher, Match } from '../lib';

interface Case {
  readonly name: string;
  readonly note?: string;
  readonly matcher: Matcher;
  readonly target: any;
}

const CASES: Case[] = [
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Match.objectLike with mismatched string value',
    target: {
      Value: 'Balue',
      Other: 'Other',
    },
    matcher: Match.objectLike({
      Value: 'Value',
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Deep Match.objectLike with mismatched string value',
    target: {
      Deep: {
        Value: 'Balue',
        Other: 'Other',
      },
    },
    matcher: Match.objectLike({
      Deep: {
        Value: 'Value',
      },
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Match.objectEquals with unexpected key',
    target: {
      Value: 'Value',
      Other: 'Other',
    },
    matcher: Match.objectEquals({
      Value: 'Value',
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Match.objectEquals with missing key',
    target: {
    },
    matcher: Match.objectEquals({
      Value: 'Value',
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Match.objectLike looking for absent key',
    target: {
      Value: 'Value',
    },
    matcher: Match.objectEquals({
      Value: Match.absent(),
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Abridged rendering of uninteresting keys (showing Other)',
    target: {
      Other: { OneKey: 'Visible' },
      Value: 'Value',
    },
    matcher: Match.objectLike({
      Value: 'Balue',
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Abridged rendering of uninteresting keys (hiding Other)',
    target: {
      Other: { OneKey: 'Visible', TooMany: 'Keys' },
      Value: 'Value',
    },
    matcher: Match.objectLike({
      Value: 'Balue',
    }),
  },
  //////////////////////////////////////////////////////////////////////
  {
    name: 'Encodedjson matcher',
    target: {
      Json: JSON.stringify({
        Value: 'Value',
      }),
    },
    matcher: Match.objectLike({
      Json: Match.serializedJson({
        Value: 'Balue',
      }),
    }),
  },
];

CASES.forEach(c => {
  test(c.name, () => {
    const result = c.matcher.test(c.target);
    expect(`${c.note ?? ''}\n${result.renderMismatch()}`).toMatchSnapshot();
  });
});