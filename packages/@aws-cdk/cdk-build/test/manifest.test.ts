import { Manifest } from '../lib/manifest';
import CopyTask from '../lib/tasks/copy';
import DockerTask from '../lib/tasks/docker';
import ZipTask from '../lib/tasks/zip';

test('create session from manifest', () => {
  const manifest = new Manifest({
    steps: {
      copyStep: {
        type: 'copy',
        parameters: {
          src: 'from',
          dest: 'to'
        }
      },
      zipStep: {
        type: 'zip',
        parameters: {
          src: 'src',
          dest: 'dest'
        }
      },
      dockerStep: {
        type: 'docker',
        parameters: {
          dir: 'dir',
          tag: 'tag'
        }
      }
    }
  });

  const session = manifest.createSession();
  expect(session.pending.map(x => x.id)).toEqual([ 'copyStep', 'dockerStep', 'zipStep' ]);
  expect(session.pending[0]).toBeInstanceOf(CopyTask);
  expect(session.pending[1]).toBeInstanceOf(DockerTask);
  expect(session.pending[2]).toBeInstanceOf(ZipTask);
});

test('dependencies mapped from manifest', async () => {
  const manifest = new Manifest({
    steps: {
      step1: {
        type: 'copy',
        parameters: { src: 'from', dest: 'to' },
        depends: [ 'step2' ]
      },
      step2: {
        type: 'copy',
        parameters: { src: 'from', dest: 'to' },
      }
    }
  });

  const session = manifest.createSession();
  expect(session.ready.map(x => x.id)).toEqual([ 'step2' ]); // only step2 is ready
});