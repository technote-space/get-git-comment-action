import type { Context } from '@actions/github/lib/context';
import type { Logger } from '@technote-space/github-action-log-helper';
import { exportVariable, getInput, setOutput } from '@actions/core' ;
import { getCommitMessage } from './utils/command';

export const setResult = (message: string): void => {
  setOutput('message', message);
  const envName = getInput('SET_ENV_NAME');
  if (envName) {
    exportVariable(envName, message);
  }
};

export const dumpResult = (message: string, logger: Logger): void => {
  logger.startProcess('Dump output');
  console.log('message: ', message);
  logger.endProcess();
};

export const execute = async(logger: Logger, context: Context): Promise<void> => {
  const message = await getCommitMessage(logger, context);
  setResult(message);
  dumpResult(message, logger);
};
