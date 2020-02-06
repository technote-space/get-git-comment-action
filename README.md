# Get git comment action

[![CI Status](https://github.com/technote-space/get-git-comment-action/workflows/CI/badge.svg)](https://github.com/technote-space/get-git-comment-action/actions)
[![codecov](https://codecov.io/gh/technote-space/get-git-comment-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/get-git-comment-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/get-git-comment-action/badge)](https://www.codefactor.io/repository/github/technote-space/get-git-comment-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/get-git-comment-action/blob/master/LICENSE)

GitHub actions to get git comment.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Screenshots](#screenshots)
- [Usage](#usage)
- [Outputs](#outputs)
  - [message](#message)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Screenshots

## Usage
e.g.
```yaml
on:
  pull_request:
  push:
    branches:
      - master
    tags:
      - "!*"
name: CI
jobs:
  eslint:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: technote-space/get-git-comment-action@v1
      - name: Install Package dependencies
        run: yarn install
        if: "! contains(env.COMMIT_MESSAGE, '[skip ci]') && ! contains(env.COMMIT_MESSAGE, '[ci skip]')"
      - name: Check code style
        run: yarn test
        if: "! contains(env.COMMIT_MESSAGE, '[skip ci]') && ! contains(env.COMMIT_MESSAGE, '[ci skip]')"
```

## Outputs
### message
#### if eventName == push
`payload.head_commit.message`
#### else
1. `git log --format=%B {{ sha }}`

   e.g.
   ```
   test1 test2  
   
   test3
   ```
1. Split at line break

   e.g.
   ```
   ['test1 test2', '', 'test3']
   ```
1. Trim and filter

   e.g.
   ```
   ['test1 test2', 'test3']
   ```
1. Combine by `SEPARATOR` option

   e.g.
   ```
   test1 test2 test3
   ```

* sha
   1. context.payload.pull_request.head.sha
   1. context.payload.deployment.sha
   1. context.sha

.

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
