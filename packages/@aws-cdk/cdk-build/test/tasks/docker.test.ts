import DockerTask, { IDocker } from '../../lib/tasks/docker';

test('the "docker" task can be used to build a docker image', async () => {
  const docker = new DockerMock();
  const task = new DockerTask('docker', {
    dir: 'source-dir',
    tag: 'my-tag',
    docker
  });

  expect(await task.build()).toBeTruthy();
  expect(docker.received).toEqual('build --tag my-tag source-dir');
});

test('if the tag already exists, the build will no-op', async () => {
  const docker = new DockerMock();
  docker.imageExists = true;
  const task = new DockerTask('docker', {
    dir: 'source-dir',
    tag: 'my-tag',
    docker
  });

  expect(await task.build()).toBeFalsy();
  expect(docker.received).toEqual('images -q my-tag');
});

class DockerMock implements IDocker {
  public imageExists = false;
  public received?: string;

  public async exec(command: string, ...args: string[]) {
    this.received = `${command} ${args.join(' ')}`;

    if (command === 'images') {
      if (this.imageExists) {
        return 'caf27325b298\n';
      } else {
        return '';
      }
    }

    return 'ok';
  }
}
