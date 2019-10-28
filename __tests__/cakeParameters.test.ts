import { CakeArgument, CakeSwitch } from '../src/cakeParameter';

describe('When converting Cake parameters to strings', () => {
  test('it should format an argument using the correct syntax', () => {
    const sut = new CakeArgument('param', 'arg');
    expect(sut.format()).toBe('--param=arg');
  });

  test('it should format a switch using the correct syntax', () => {
    const sut = new CakeSwitch('switch');
    expect(sut.format()).toBe('--switch');
  });
});

describe('When converting empty Cake parameters to strings', () => {
  test('it should format a parameter without name as an empty string', () => {
    const sut = new CakeArgument('', 'arg');
    expect(sut.format()).toHaveLength(0);
  });

  test('it should format a parameter without argument as an empty string', () => {
    const sut = new CakeArgument('param', '');
    expect(sut.format()).toHaveLength(0);
  });

  test('it should format a switch without name as an empty string', () => {
    const sut = new CakeSwitch('');
    expect(sut.format()).toHaveLength(0);
  });
});

describe('When checking whether a Cake parameter is valid', () => {
  test('it should consider a parameter with a name and a value to be valid', () => {
    const sut = new CakeArgument('param', 'arg');
    expect(sut.isValid()).toBe(true);
  });

  test('it should consider a parameter without name to be invalid', () => {
    const sut = new CakeArgument('', 'arg');
    expect(sut.isValid()).toBe(false);
  });

  test('it should consider a parameter without argument to be invalid', () => {
    const sut = new CakeArgument('param', '');
    expect(sut.isValid()).toBe(false);
  });

  test('it should consider a switch with a name to be valid', () => {
    const sut = new CakeSwitch('switch');
    expect(sut.isValid()).toBe(true);
  });

  test('it should consider a switch without name to be invalid', () => {
    const sut = new CakeSwitch('');
    expect(sut.isValid()).toBe(false);
  });
});
