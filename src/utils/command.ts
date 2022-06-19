import type { Context } from '@actions/github/lib/context';
import type { Logger } from '@technote-space/github-action-log-helper';
import { getInput } from '@actions/core' ;
import { Command, Utils } from '@technote-space/github-action-helper';

// 1. get directly
//   1. payload.head_commit.message		// push
// 2. get by git log
//   1. payload.pull_request.head.sha 	// pull_request, pull_request_review, pull_request_review_comment
//   2. payload.deployment.sha			// deployment, deployment_status
//   3. sha 							// others

const refsPrefix           = 'refs/';
const branchRefsPrefix     = `${refsPrefix}heads/`;
const getRawInput          = (name: string): string => process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
const getSeparator         = (): string => getRawInput('SEPARATOR');
const getFormat            = (): string => getInput('FORMAT', { required: true });
const getHeadCommitMessage = (context: Context): string | undefined => context.payload.head_commit?.message;
const normalizeRef         = (ref: string): string => Utils.getPrefixRegExp(refsPrefix).test(ref) ? ref : `${branchRefsPrefix}${ref}`;

const getTarget = (context: Context): { ref: string; sha: string } => {
  const prHead = context.payload.pull_request?.head;
  if (prHead) {
    return {
      ref: normalizeRef(prHead.ref),
      sha: prHead.sha,
    };
  }

  if (context.payload.deployment) {
    return {
      ref: normalizeRef(context.payload.deployment.ref),
      sha: context.payload.deployment.sha,
    };
  }

  return {
    ref: normalizeRef(context.ref),
    sha: context.sha,
  };
};

export const getCommitMessage = async(logger: Logger, context: Context): Promise<string> => {
  const headCommitMessage = getHeadCommitMessage(context);
  if (headCommitMessage !== undefined) {
    return headCommitMessage;
  }

  const command      = new Command(logger);
  const { ref, sha } = getTarget(context);
  if (Utils.getPrefixRegExp(branchRefsPrefix).test(ref)) {
    await command.execAsync({
      command: 'git fetch',
      args: ['--no-tags', 'origin', `+${ref}:refs/remotes/origin/${ref.replace(Utils.getPrefixRegExp(branchRefsPrefix), '')}`],
      stderrToStdout: true,
      cwd: Utils.getWorkspace(),
    });
  }

  return Utils.split((await command.execAsync({
    command: 'git log',
    args: ['-1', '--format=' + getFormat(), sha],
    cwd: Utils.getWorkspace(),
  })).stdout).map(item => item.trim()).filter(item => item).join(getSeparator());
};
