import { cliProgress } from './lib/index.js';

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

(async () => {
  const p1 = new cliProgress();
  p1.start();
  await sleep(1000);
  p1.done();
  console.log();

  const p2 = new cliProgress();
  p2.start('Downloading files');
  await sleep(1000);
  p2.update('Downloading files - [1/2]');
  await sleep(1000);
  p2.update('Downloading files - [2/2]');
  await sleep(1000);
  p2.done('Download completed.');
  console.log();

  const p3 = new cliProgress();
  p3.start();
  await sleep(1000);
  p3.fail('Network error!');
  console.log();

  const p4 = new cliProgress();
  p4.start();
  await sleep(1000);
  p4.warn('Caution!');
  console.log();

  const p5 = new cliProgress();
  p5.start();
  await sleep(1000);
  p5.info('Some usefull info');
})();
