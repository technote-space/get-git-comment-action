/* eslint-disable no-magic-numbers */
import path from 'path';
import {
	getContext,
	testEnv,
	spyOnSpawn,
	testChildProcess,
	execCalledWith,
	setChildProcessParams,
} from '@technote-space/github-action-test-helper';
import { getCommitMessage } from '../../src/utils/command';

const rootDir = path.resolve(__dirname, '../..');

describe('getCommitMessage', () => {
	testEnv(rootDir);
	testChildProcess();

	it('should return commit message (push)', async() => {
		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
			eventName: 'push',
			ref: 'refs/heads/master',
			sha: '1111',
			payload: {
				'head_commit': {
					message: 'test message',
				},
			},
		}))).toBe('test message');

		execCalledWith(mockExec, []);
	});

	it('should return commit message (pull request)', async() => {
		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
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
		}))).toBe('test1 test2 test3');

		execCalledWith(mockExec, [
			'git fetch --no-tags origin \'+refs/heads/feature/change:refs/remotes/origin/feature/change\'',
			'git log -1 \'--format=%B\' 1234',
		]);
	});

	it('should return commit message (deployment)', async() => {
		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
			eventName: 'deployment',
			ref: 'refs/heads/master',
			sha: '1111',
			payload: {
				deployment: {
					sha: '1234',
					ref: 'master',
				},
			},
		}))).toBe('test1 test2 test3');

		execCalledWith(mockExec, [
			'git fetch --no-tags origin \'+refs/heads/master:refs/remotes/origin/master\'',
			'git log -1 \'--format=%B\' 1234',
		]);
	});

	it('should return commit message (create tag)', async() => {
		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
			eventName: 'create',
			ref: 'refs/tags/v1.2.3',
			sha: '1111',
		}))).toBe('test1 test2 test3');

		execCalledWith(mockExec, [
			'git log -1 \'--format=%B\' 1111',
		]);
	});

	it('should return commit message (schedule)', async() => {
		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
			eventName: 'schedule',
			ref: 'refs/heads/master',
			sha: '1111',
			payload: {
				schedule: '0 0 * * *',
			},
		}))).toBe('test1 test2 test3');

		execCalledWith(mockExec, [
			'git fetch --no-tags origin \'+refs/heads/master:refs/remotes/origin/master\'',
			'git log -1 \'--format=%B\' 1111',
		]);
	});

	it('should return commit message (set env 1)', async() => {
		process.env.INPUT_SEPARATOR = '::';
		process.env.INPUT_FORMAT    = '%an';

		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: (command: string): string => {
				if (command.startsWith('git log')) {
					return 'test1\ntest2\n\ntest3\n\n\n';
				}
				return '';
			},
		});

		expect(await getCommitMessage(getContext({
			eventName: 'create',
			ref: 'refs/heads/master',
			sha: '1111',
		}))).toBe('test1::test2::test3');

		execCalledWith(mockExec, [
			'git fetch --no-tags origin \'+refs/heads/master:refs/remotes/origin/master\'',
			'git log -1 \'--format=%an\' 1111',
		]);
	});

	it('should return commit message (set env 2)', async() => {
		process.env.INPUT_SEPARATOR = '';

		const mockExec = spyOnSpawn();
		setChildProcessParams({
			stdout: '',
		});

		expect(await getCommitMessage(getContext({
			eventName: 'create',
			ref: 'refs/heads/master',
			sha: '1111',
		}))).toBe('');

		execCalledWith(mockExec, [
			'git fetch --no-tags origin \'+refs/heads/master:refs/remotes/origin/master\'',
			'git log -1 \'--format=%B\' 1111',
		]);
	});
});
