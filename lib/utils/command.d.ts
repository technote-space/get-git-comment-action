import type { Context } from '@actions/github/lib/context';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const getCommitMessage: (logger: Logger, context: Context) => Promise<string>;
