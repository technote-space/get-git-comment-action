import type { Context } from '@actions/github/lib/context';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const setResult: (message: string) => void;
export declare const dumpResult: (message: string, logger: Logger) => void;
export declare const execute: (logger: Logger, context: Context) => Promise<void>;
