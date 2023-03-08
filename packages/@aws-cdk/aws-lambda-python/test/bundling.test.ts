import * as fs from 'fs';
import * as path from 'path';
import { Architecture, Code, Runtime } from '@aws-cdk/aws-lambda';
import { BundlingFileAccess, DockerImage } from '@aws-cdk/core';
import { Bundling } from '../lib/bundling';

jest.spyOn(Code, 'fromAsset');
jest.spyOn(DockerImage, 'fromBuild');

jest.mock('child_process', () => ({
  spawnSync: jest.fn(() => {
    return {
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('sha256:1234567890abcdef'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    };
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('Bundling a function without dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');
  const assetCode = Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output && cd /asset-output',
      ],
    }),
  }));

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(path.join(__dirname, '../lib')), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-python/),
    }),
    platform: 'linux/amd64',
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
});

test('Bundling a function with requirements.txt', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  const assetCode = Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output && cd /asset-output && python -m pip install -r requirements.txt -t /asset-output',
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('requirements.txt');
  expect(files).toContain('.ignorelist');
});

test('Bundling a function with requirements.txt using assetExcludes', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  const assetCode = Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    architecture: Architecture.X86_64,
    assetExcludes: ['.ignorelist'],
  });

  // Correctly bundles
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        "rsync -rLv --exclude='.ignorelist' /asset-input/ /asset-output && cd /asset-output && python -m pip install -r requirements.txt -t /asset-output",
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('requirements.txt');
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output && cd /asset-output && python -m pip install -r requirements.txt -t /asset-output',
      ],
    }),
  }));
});

test('Bundling Python 2.7 with requirements.txt installed', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_2_7,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with requirements.txt pip installed
  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output && cd /asset-output && python -m pip install -r requirements.txt -t /asset-output',
      ],
    }),
  }));
});

test('Bundling a layer with dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler');

  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python && python -m pip install -r requirements.txt -t /asset-output/python',
      ],
    }),
  }));
});

test('Bundling a python code layer', () => {
  const entry = path.join(__dirname, 'lambda-handler-nodeps');

  Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python',
      ],
    }),
  }));
});

test('Bundling a function with pipenv dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-pipenv');

  const assetCode = Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python && PIPENV_VENV_IN_PROJECT=1 pipenv lock -r > requirements.txt && rm -rf .venv && python -m pip install -r requirements.txt -t /asset-output/python',
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('Pipfile');
  expect(files).toContain('Pipfile.lock');
  // Contains hidden files.
  expect(files).toContain('.ignorefile');
});

test('Bundling a function with pipenv dependencies with assetExcludes', () => {
  const entry = path.join(__dirname, 'lambda-handler-pipenv');

  const assetCode = Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
    assetExcludes: ['.ignorefile'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        "rsync -rLv --exclude='.ignorefile' /asset-input/ /asset-output/python && cd /asset-output/python && PIPENV_VENV_IN_PROJECT=1 pipenv lock -r > requirements.txt && rm -rf .venv && python -m pip install -r requirements.txt -t /asset-output/python",
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('Pipfile');
  expect(files).toContain('Pipfile.lock');
  // Contains hidden files.
  expect(files).toContain('.ignorefile');
});

test('Bundling a function with poetry dependencies', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');

  const assetCode = Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python && poetry export --without-hashes --with-credentials --format requirements.txt --output requirements.txt && python -m pip install -r requirements.txt -t /asset-output/python',
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('pyproject.toml');
  expect(files).toContain('poetry.lock');
  // Contains hidden files.
  expect(files).toContain('.ignorefile');
});

test('Bundling a function with poetry and assetExcludes', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');

  Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
    assetExcludes: ['.ignorefile'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        "rsync -rLv --exclude='.ignorefile' /asset-input/ /asset-output/python && cd /asset-output/python && poetry export --without-hashes --with-credentials --format requirements.txt --output requirements.txt && python -m pip install -r requirements.txt -t /asset-output/python",
      ],
    }),
  }));

});

test('Bundling a function with poetry and no assetExcludes', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');

  Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.not.stringContaining('--exclude'),
      ],
    }),
  }));
});

test('Bundling a function with poetry dependencies, with hashes', () => {
  const entry = path.join(__dirname, 'lambda-handler-poetry');

  const assetCode = Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
    poetryIncludeHashes: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python && poetry export --with-credentials --format requirements.txt --output requirements.txt && python -m pip install -r requirements.txt -t /asset-output/python',
      ],
    }),
  }));

  const files = fs.readdirSync(assetCode.path);
  expect(files).toContain('index.py');
  expect(files).toContain('pyproject.toml');
  expect(files).toContain('poetry.lock');
  // Contains hidden files.
  expect(files).toContain('.ignorefile');
});

test('Bundling a function with custom bundling image', () => {
  const entry = path.join(__dirname, 'lambda-handler-custom-build');
  const image = DockerImage.fromBuild(path.join(entry));

  Bundling.bundle({
    entry: path.join(entry, '.'),
    runtime: Runtime.PYTHON_3_9,
    architecture: Architecture.X86_64,
    outputPathSuffix: 'python',
    image,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      image,
      command: [
        'bash', '-c',
        'rsync -rLv /asset-input/ /asset-output/python && cd /asset-output/python && python -m pip install -r requirements.txt -t /asset-output/python',
      ],
    }),
  }));

  expect(DockerImage.fromBuild).toHaveBeenCalledTimes(1);
  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(entry));
});

test('Bundling with custom build args', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  const testPypi = 'https://test.pypi.org/simple/';
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    buildArgs: { PIP_INDEX_URL: testPypi },
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(path.join(__dirname, '../lib')), expect.objectContaining({
    buildArgs: expect.objectContaining({
      PIP_INDEX_URL: testPypi,
    }),
  }));
});

test('Bundling with custom environment vars`', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    environment: {
      KEY: 'value',
    },
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
      },
    }),
  }));
});

test('Bundling with volumes from other container', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    volumesFrom: ['777f7dc92da7'],

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      volumesFrom: ['777f7dc92da7'],
    }),
  }));
});

test('Bundling with custom volume paths', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
    }),
  }));
});

test('Bundling with custom working directory', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    workingDirectory: '/my-dir',

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      workingDirectory: '/my-dir',
    }),
  }));
});

test('Bundling with custom user', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    user: 'user:group',

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      user: 'user:group',
    }),
  }));
});

test('Bundling with custom securityOpt', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    securityOpt: 'no-new-privileges',

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      securityOpt: 'no-new-privileges',
    }),
  }));
});

test('Bundling with custom network', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    network: 'host',

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      network: 'host',
    }),
  }));
});

test('Bundling with docker copy variant', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,

  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
    }),
  }));
});

test('Do not build docker image when skipping bundling', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    skip: true,
  });

  expect(DockerImage.fromBuild).not.toHaveBeenCalled();
});

test('Build docker image when bundling is not skipped', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    skip: false,
  });

  expect(DockerImage.fromBuild).toHaveBeenCalled();
});

test('with command hooks', () => {
  const entry = path.join(__dirname, 'lambda-handler');
  Bundling.bundle({
    entry: entry,
    runtime: Runtime.PYTHON_3_7,
    skip: false,
    commandHooks: {
      beforeBundling(inputDir: string, outputDir: string): string[] {
        return [
          `echo hello > ${inputDir}/a.txt`,
          `cp ${inputDir}/a.txt ${outputDir}`,
        ];
      },
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/b.txt ${outputDir}/txt`];
      },
    },
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(entry, expect.objectContaining({
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringMatching(/^echo hello > \/asset-input\/a.txt && cp \/asset-input\/a.txt \/asset-output && .+ && cp \/asset-input\/b.txt \/asset-output\/txt$/),
      ],
    }),
  }));
});
