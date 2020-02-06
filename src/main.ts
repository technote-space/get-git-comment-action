import path from 'path';
import { setFailed } from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { Logger, ContextHelper } from '@technote-space/github-action-helper';
import { execute } from './process';

/**
 * run
 */
async function run(): Promise<void> {
	const logger  = new Logger();
	const context = new Context();
	ContextHelper.showActionInfo(path.resolve(__dirname, '..'), logger, context);

	await execute(logger, context);
}

run().catch(error => setFailed(error.message));
