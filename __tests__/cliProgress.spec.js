import { cliProgress } from '../lib/index.esm.js';
import { jest } from '@jest/globals';

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const stdErrorSpy = jest.spyOn(process.stderr, 'write');
stdErrorSpy.mockImplementation(() => true);

describe('cliProgress', () => {
  test('default loading', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.done();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m✔️\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  it('changes default loading to Downloading', async () => {
    const progress = new cliProgress();
    progress.start('Downloading');
    await sleep(100);
    progress.done();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Downloading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m✔️\x1B[39;2;m\x1B[39;2;m  Downloading \n'
    );
  });

  test('done with text', async () => {
    const progress = new cliProgress();
    progress.start('Downloading');
    await sleep(100);
    progress.done('Done!');
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Downloading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m✔️\x1B[39;2;m\x1B[39;2;m  Done! \n'
    );
  });

  test('fail', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.fail();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;65;54m❌\x1B[39;2;m\x1B[39;2;m Loading \n'
    );
  });

  it('fails with text', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.fail('Network Error!');
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;65;54m❌\x1B[39;2;m\x1B[39;2;m Network Error! \n'
    );
  });

  test('warn', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.warn();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;220;0m⚠️\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  it('warns with text', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.warn('Caution!');
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;255;220;0m⚠️\x1B[39;2;m\x1B[39;2;m  Caution! \n'
    );
  });

  test('info', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.info();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;127;219;255mℹ️\x1B[39;2;m\x1B[39;2;m  Loading \n'
    );
  });

  test('info with text', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.info('Some usefull info');
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;127;219;255mℹ️\x1B[39;2;m\x1B[39;2;m  Some usefull info \n'
    );
  });

  it('Updates default text', async () => {
    const progress = new cliProgress();
    progress.start();
    await sleep(100);
    progress.update('Searching');
    await sleep(100);
    progress.done();
    expect(stdErrorSpy).toBeCalled();
    const output = stdErrorSpy.mock.calls.flat();
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠋\x1B[39;2;m\x1B[39;2;m Loading '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m⠙\x1B[39;2;m\x1B[39;2;m Searching '
    );
    expect(output).toContain(
      '\x1B[1;38;2m\x1B[38;2;46;204;64m✔️\x1B[39;2;m\x1B[39;2;m  Searching \n'
    );
  });
});
