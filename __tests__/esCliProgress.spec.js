import esCliProgress from '../lib/index.js';

describe('esCliProgress', () => {
  test('index', () => {
    expect(esCliProgress()).toMatch(/Hello World!/);
  });
});
