import { PassThrough } from 'stream';

import { cliProgress } from '../lib/index.esm.js';

function getStream() {
  const stream = new PassThrough();
  stream.clearLine = () => true;
  stream.cursorTo = () => true;
  stream.isTTY = true;

  return stream;
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function getOutput(stream) {
  const output = [];

  return new Promise((resolve) => {
    stream.on('data', (data) => {
      output.push(data.toString());
    });

    stream.on('end', () => {
      resolve(output);
    });
  });
}

async function run(cb) {
  const stream = getStream();
  const outputPromise = getOutput(stream);
  const progress = new cliProgress(stream);
  await cb(progress);
  stream.end();

  return await outputPromise;
}

describe('cliProgress', () => {
  test('default loading', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.done();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m\u{2714}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  it('changes default loading to Downloading', async () => {
    const output = await run(async (progress) => {
      progress.start('Downloading');
      await sleep(100);
      progress.done();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Downloading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m\u{2714}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Downloading \n'
    );
  });

  test('done with text', async () => {
    const output = await run(async (progress) => {
      progress.start('Downloading');
      await sleep(100);
      progress.done('Done!');
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Downloading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m\u{2714}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Done! \n'
    );
  });

  test('fail', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.fail();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;65;54m\u{274C}\u{FE0F}\x1B[39;2;m\x1B[39;2;m Loading \n'
    );
  });

  it('fails with text', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.fail('Network Error!');
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;65;54m\u{274C}\u{FE0F}\x1B[39;2;m\x1B[39;2;m Network Error! \n'
    );
  });

  test('warn', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.warn();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;220;0m\u{26A0}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  it('warns with text', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.warn('Caution!');
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;220;0m\u{26A0}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Caution! \n'
    );
  });

  test('info', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.info();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;127;219;255m\u{2139}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  test('info with text', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.info('Some usefull info');
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;127;219;255m\u{2139}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Some usefull info \n'
    );
  });

  it('Updates default text', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.update('Searching');
      await sleep(100);
      progress.done();
    });

    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠙\x1B[39;2;m\x1B[39;2;m Searching '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m\u{2714}\u{FE0F}\x1B[39;2;m\x1B[39;2;m  Searching \n'
    );
  });
});
