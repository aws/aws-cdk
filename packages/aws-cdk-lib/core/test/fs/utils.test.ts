import * as fs from 'fs';
import * as path from 'path';
import { ImportMock } from 'ts-mock-imports';
import { SymlinkFollowMode } from '../../lib/fs';
import * as util from '../../lib/fs/utils';

describe('utils', () => {
  describe('shouldFollow', () => {
    describe('always', () => {
      test('follows internal', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');

        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(true);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('follows external', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(true);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow internal when the referent does not exist', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow external when the referent does not exist', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });
    });

    describe('external', () => {
      test('does not follow internal', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          expect(util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.notCalled).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('follows external', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(true);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow external when referent does not exist', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });
    });

    describe('blockExternal', () => {
      test('follows internal', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(true);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow internal when referent does not exist', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          expect(util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow external', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          expect(util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.notCalled).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });
    });

    describe('never', () => {
      test('does not follow internal', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          expect(util.shouldFollow(SymlinkFollowMode.NEVER, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.notCalled).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });

      test('does not follow external', () => {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          expect(util.shouldFollow(SymlinkFollowMode.NEVER, sourceRoot, linkTarget)).toEqual(false);
          expect(mockFsExists.notCalled).toEqual(true);
          ;
        } finally {
          mockFsExists.restore();
        }
      });
    });
  });
});
