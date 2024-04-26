import * as http from '@actions/http-client';
import * as cakeRelease from '../src/cakeRelease';

describe('When retrieving the latest Cake version', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 200,
        result: {
          tag_name: 'v1.0.0'
        },
        headers: {}
      }));
  });

  test('it should return the latest version number from GitHub', async () => {
    expect(await cakeRelease.getLatestVersion()).toBe('1.0.0');
  });
});

describe('When retrieving the latest Cake version without the \'v\' prefix', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 200,
        result: {
          tag_name: '1.0.0'
        },
        headers: {}
      }));
  });

  test('it should return the latest version number from GitHub', async () => {
    expect(await cakeRelease.getLatestVersion()).toBe('1.0.0');
  });
});

describe('When failing to retrieve the latest Cake version due to a GitHub error', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 500,
        result: {},
        headers: {}
      }));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });

  test('it should log the fact that the GitHub API returned an error', async () => {
    const log = jest.spyOn(console, 'log');
    await cakeRelease.getLatestVersion();
    expect(log).toHaveBeenCalledWith('Could not determine the latest version of Cake. GitHub returned status code 500');
  });
});

describe('When failing to retrieve the latest Cake version due to an empty response from GitHub', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 200,
        result: {},
        headers: {}
      }));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});

describe('When failing to retrieve the latest Cake version due to a missing tag name in the GitHub response', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 200,
        result: {
          tag_name: null
        },
        headers: {}
      }));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});

describe('When failing to retrieve the latest Cake version due to an empty tag name in the GitHub response', () => {
  beforeAll(async () => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation(async () => ({
        statusCode: 200,
        result: {
          tag_name: ''
        },
        headers: {}
      }));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});
