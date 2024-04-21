import { sum } from '../src';

describe('Sum', () => {
  it('should sum two numbers', async () => {
    expect(sum(1, 2)).toBe(3);
  });
});
