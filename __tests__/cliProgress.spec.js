import { PassThrough } from 'stream';

import { cliProgress } from '../lib/index.esm.js';

function getStream(isTTY = true) {
  const stream = new PassThrough();
  stream.clearLine = () => true;
  stream.cursorTo = () => true;
  stream.isTTY = isTTY;

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

async function run(cb, isTTY = true) {
  const stream = getStream(isTTY);
  const outputPromise = getOutput(stream);
  const progress = new cliProgress({ stream: stream });
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

  test('non interactive stream default loading', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.done();
    }, false);
    expect(output[0]).toContain('\u{2B50} Loading\n');
    expect(output[1]).toContain('\u{2714} Loading \n');
  });

  test('non interactive stream with update', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.update('Installing');
      await sleep(100);
      progress.done('Installed!');
    }, false);
    expect(output[0]).toContain('\u{2B50} Loading\n');
    expect(output[1]).toContain('\u{2B50} Installing \n');
    expect(output[2]).toContain('\u{2714} Installed! \n');
  });

  test('non interactive stream fail', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.fail('Failed!');
    }, false);
    expect(output[0]).toContain('\u{2B50} Loading\n');
    expect(output[1]).toContain('\u{274C} Failed! \n');
  });

  test('non interactive stream that warns', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.warn();
    }, false);
    expect(output[0]).toContain('\u{2B50} Loading\n');
    expect(output[1]).toContain('\u{26A0} Loading \n');
  });

  test('non interactive stream with info', async () => {
    const output = await run(async (progress) => {
      progress.start();
      await sleep(100);
      progress.info('Downloaded files: 10');
    }, false);
    expect(output[0]).toContain('\u{2B50} Loading\n');
    expect(output[1]).toContain('\u{2139} Downloaded files: 10 \n');
  });

  it('does not throw any errors', async () => {
    const p1 = new cliProgress();
    expect(() => p1.start()).not.toThrow();
    expect(() => p1.done()).not.toThrow();

    const p2 = new cliProgress();
    expect(() => p2.start()).not.toThrow();
    expect(() => p2.update('Updated text')).not.toThrow();
    expect(() => p2.done()).not.toThrow();

    const p3 = new cliProgress();
    expect(() => p3.start()).not.toThrow();
    expect(() => p3.fail()).not.toThrow();

    const p4 = new cliProgress();
    expect(() => p4.start()).not.toThrow();
    expect(() => p4.warn()).not.toThrow();

    const p5 = new cliProgress();
    expect(() => p5.start()).not.toThrow();
    expect(() => p5.info()).not.toThrow();
  });
});
