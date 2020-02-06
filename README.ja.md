# Get git comment action

[![CI Status](https://github.com/technote-space/get-git-comment-action/workflows/CI/badge.svg)](https://github.com/technote-space/get-git-comment-action/actions)
[![codecov](https://codecov.io/gh/technote-space/get-git-comment-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/get-git-comment-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/get-git-comment-action/badge)](https://www.codefactor.io/repository/github/technote-space/get-git-comment-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/get-git-comment-action/blob/master/LICENSE)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

これは Git コメントを取得する `GitHub Actions` です。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [スクリーンショット](#%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88)
  - [Skip CI](#skip-ci)
  - [Not skip CI](#not-skip-ci)
- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [出力](#%E5%87%BA%E5%8A%9B)
  - [message](#message)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## スクリーンショット
### Skip CI
![skip ci](https://raw.githubusercontent.com/technote-space/get-git-comment-action/images/skip.png)

### Not skip CI
![not skip ci](https://raw.githubusercontent.com/technote-space/get-git-comment-action/images/not_skip.png)

## 使用方法
例：
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

## 出力
### message
#### if eventName == push
`payload.head_commit.message`
#### else
1. `git log --format=%B {{ sha }}`

   例：
   ```
   test1 test2  
   
   test3
   ```
1. 改行で分割

   例：
   ```
   ['test1 test2', '', 'test3']
   ```
1. トリム及び空白行の削除

   例：
   ```
   ['test1 test2', 'test3']
   ```
1. `SEPARATOR` オプションの値で結合

   例：
   ```
   test1 test2 test3
   ```

* sha
   1. context.payload.pull_request.head.sha
   1. context.payload.deployment.sha
   1. context.sha

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
