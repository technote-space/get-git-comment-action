/* eslint-disable no-magic-numbers */
import path from 'path';
import {
  getContext,
  testEnv,
  spyOnStdout,
  stdoutCalledWith,
  spyOnSpawn,
  testChildProcess,
  setChildProcessParams,
  execContains,
  spyOnExportVariable,
  exportVariableCalledWith,
} from '@technote-space/github-action-test-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {setResult, execute} from '../src/process';

const rootDir = path.resolve(__dirname, '..');

describe('setResult', () => {
  testEnv(rootDir);

  it('should set result', () => {
    const mockStdout = spyOnStdout();
    const mockEnv    = spyOnExportVariable();

    setResult('test message');

    stdoutCalledWith(mockStdout, [
      '',
      '::set-output name=message::test message',
    ]);
    exportVariableCalledWith(mockEnv, [
      {name: 'COMMIT_MESSAGE', val: 'test message'},
    ]);
  });

  it('should set result without env', () => {
    process.env.INPUT_SET_ENV_NAME = '';
    const mockStdout               = spyOnStdout();

    setResult('');

    stdoutCalledWith(mockStdout, [
      '',
      '::set-output name=message::',
    ]);
  });
});

describe('execute', () => {
  testEnv(rootDir);
  testChildProcess();

  it('should execute', async() => {
    const mockExec   = spyOnSpawn();
    const mockStdout = spyOnStdout();
    const mockEnv    = spyOnExportVariable();
    setChildProcessParams({
      stdout: (command: string): string => {
        if (command.startsWith('git log')) {
          return 'test1\ntest2\n\ntest3\n\n\n';
        }
        return '';
      },
    });

    await execute(new Logger(), getContext({
      eventName: 'pull_request',
      ref: 'refs/pull/11/merge',
      sha: '1111',
      payload: {
        'pull_request': {
          head: {
            ref: 'feature/change',
            sha: '1234',
          },
        },
      },
    }));

    execContains(mockExec, [
      'git fetch --no-tags origin \'+refs/heads/feature/change:refs/remotes/origin/feature/change\'',
      'git log -1 \'--format=%B\' 1234',
    ]);
    stdoutCalledWith(mockStdout, [
      '[command]git fetch --no-tags origin \'+refs/heads/feature/change:refs/remotes/origin/feature/change\'',
      '[command]git log -1 \'--format=%B\' 1234',
      '  >> test1',
      '  >> test2',
      '  >> ',
      '  >> test3',
      '',
      '::set-output name=message::test1 test2 test3',
      '::group::Dump output',
      '"message: "',
      '::endgroup::',
    ]);
    exportVariableCalledWith(mockEnv, [
      {name: 'COMMIT_MESSAGE', val: 'test1 test2 test3'},
    ]);
  });
});
