"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_action_helper_1 = require("@technote-space/github-action-helper");
const core_1 = require("@actions/core");
// 1. get directly
//   1. payload.head_commit.message		// push
// 2. get by git log
//   1. payload.pull_request.head.sha 	// pull_request, pull_request_review, pull_request_review_comment
//   2. payload.deployment.sha			// deployment, deployment_status
//   3. sha 							// others
const refsPrefix = 'refs/';
const branchRefsPrefix = `${refsPrefix}heads/`;
const getRawInput = (name) => process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
const getSeparator = () => getRawInput('SEPARATOR');
const getFormat = () => core_1.getInput('FORMAT', { required: true });
const getHeadCommitMessage = (context) => { var _a; return (_a = context.payload.head_commit) === null || _a === void 0 ? void 0 : _a.message; };
const normalizeRef = (ref) => github_action_helper_1.Utils.getPrefixRegExp(refsPrefix).test(ref) ? ref : `${branchRefsPrefix}${ref}`;
const getTarget = (context) => {
    var _a;
    const prHead = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head;
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
exports.getCommitMessage = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const headCommitMessage = getHeadCommitMessage(context);
    if (headCommitMessage !== undefined) {
        return headCommitMessage;
    }
    const command = new github_action_helper_1.Command(new github_action_helper_1.Logger());
    const { ref, sha } = getTarget(context);
    if (github_action_helper_1.Utils.getPrefixRegExp(branchRefsPrefix).test(ref)) {
        yield command.execAsync({
            command: 'git fetch',
            args: ['--no-tags', 'origin', `+${ref}:refs/remotes/origin/${ref.replace(github_action_helper_1.Utils.getPrefixRegExp(branchRefsPrefix), '')}`],
            stderrToStdout: true,
            cwd: github_action_helper_1.Utils.getWorkspace(),
        });
    }
    return github_action_helper_1.Utils.split((yield command.execAsync({
        command: 'git log',
        args: ['-1', '--format=' + getFormat(), sha],
        cwd: github_action_helper_1.Utils.getWorkspace(),
    })).stdout).map(item => item.trim()).filter(item => item).join(getSeparator());
});
