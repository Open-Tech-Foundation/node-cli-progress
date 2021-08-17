<div align="center">

# @open-tech-world/node-cli-progress
[![Build](https://github.com/open-tech-world/node-cli-progress/actions/workflows/build.yml/badge.svg)](https://github.com/open-tech-world/node-cli-progress/actions/workflows/build.yml) [![CodeFactor](https://www.codefactor.io/repository/github/open-tech-world/node-cli-progress/badge)](https://www.codefactor.io/repository/github/open-tech-world/node-cli-progress) ![npm (scoped)](https://img.shields.io/npm/v/@open-tech-world/node-cli-progress?color=blue)

![](demo.gif)

</div>

> CLI spinner with task progress result.

## Installation

Using npm

```shell
npm install @open-tech-world/node-cli-progress
```

Using Yarn

```shell
yarn add @open-tech-world/node-cli-progress
```

## Usage

```ts
import { cliProgress } from '@open-tech-world/node-cli-progress';

const progress = new cliProgress();
progress.start();
setTimeout(() => {
  progress.update('Downloading');
}, 1000);
progress.done('Download completed!');
```

## API

**new cliProgress(options?: Partial\<IOptions\>)**

It creates a new instance of the cliProgress. 

options:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| stream | NodeJS.WriteStream | process.stderr | The stream to use.


#### Instance methods:

**start(text?: string)**

This method starts the spinner with optional `text`.

The default text is `Loading`.

**update(text: string)**

This method updates the `current text` with the given `text`.

**done(text?: string)**

This method stops the spinner and mark the task as `success` with optional `text`.

**fail(text?: string)**

This method stops the spinner and mark the task as `failed` with optional `text`.

**warn(text?: string)**

This method stops the spinner and mark the task as `warning` with optional `text`.

**info(text?: string)**

This method stops the spinner and mark the task as `info` with optional `text`.

## License

Copyright (c) 2021, [Thanga Ganapathy](https://thanga-ganapathy.github.io) ([MIT License](./LICENSE)).
