import { SecurityPipe } from './security.pipe';

describe('SecurityPipe', () => {
  it('create an instance', () => {
    const pipe = new SecurityPipe();
    expect(pipe).toBeTruthy();
  });
});
