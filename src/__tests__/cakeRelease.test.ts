import * as core from '@actions/core';
import * as http from '@actions/http-client';
import * as cakeRelease from '../cakeRelease';

jest.mock('@actions/core');

describe('When retrieving the latest Cake version', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {
        tag_name: 'v1.0.0',
      },
      headers: {},
    });
  });

  test('it should return the latest version number from GitHub', async () => {
    expect(await cakeRelease.getLatestVersion()).toBe('1.0.0');
  });
});

describe("When retrieving the latest Cake version without the 'v' prefix", () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {
        tag_name: '1.0.0',
      },
      headers: {},
    });
  });

  test('it should return the latest version number from GitHub', async () => {
    expect(await cakeRelease.getLatestVersion()).toBe('1.0.0');
  });
});

describe('When retrieving the latest Cake version with a GitHub token', () => {
  let getJson: jest.SpyInstance;

  beforeAll(() => {
    getJson = jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {
        tag_name: 'v1.0.0',
      },
      headers: {},
    });
  });

  beforeEach(() => {
    getJson.mockClear();
  });

  test('it should authenticate the request with the token', async () => {
    await cakeRelease.getLatestVersion('theToken');
    expect(getJson).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ Authorization: 'Bearer theToken' })
    );
  });

  test('it should not authenticate the request without a token', async () => {
    await cakeRelease.getLatestVersion();
    const [, headers] = getJson.mock.calls[0] as [string, Record<string, string>];
    expect(headers).not.toHaveProperty('Authorization');
  });
});

describe('When failing to retrieve the latest Cake version due to a GitHub error', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 500,
      result: {},
      headers: {},
    });
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });

  test('it should warn that the GitHub API returned an error', async () => {
    await cakeRelease.getLatestVersion();
    expect(core.warning).toHaveBeenCalledWith(
      'Could not determine the latest version of Cake. GitHub returned status code 500'
    );
  });
});

describe('When failing to retrieve the latest Cake version due to the GitHub rate limit', () => {
  beforeAll(() => {
    jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockRejectedValue(new http.HttpClientError('API rate limit exceeded', 403));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion('theToken')).toBeNull();
  });

  test('it should warn that the GitHub API returned an error', async () => {
    await cakeRelease.getLatestVersion('theToken');
    expect(core.warning).toHaveBeenCalledWith(
      'Could not determine the latest version of Cake. GitHub returned status code 403: API rate limit exceeded'
    );
  });
});

describe('When the GitHub token is not authorized to retrieve the latest Cake version', () => {
  let getJson: jest.SpyInstance;

  beforeAll(() => {
    getJson = jest
      .spyOn(http.HttpClient.prototype, 'getJson')
      .mockImplementation((_url, headers) =>
        headers?.Authorization
          ? Promise.reject(new http.HttpClientError('Bad credentials', 401))
          : Promise.resolve({ statusCode: 200, result: { tag_name: 'v1.0.0' }, headers: {} })
      );
  });

  test('it should retry without the token and return the latest version number', async () => {
    expect(await cakeRelease.getLatestVersion('invalidToken')).toBe('1.0.0');
    expect(getJson).toHaveBeenCalledTimes(2);
  });
});

describe('When failing to retrieve the latest Cake version due to a network error', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockRejectedValue(new Error('getaddrinfo ENOTFOUND'));
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });

  test('it should warn about the error', async () => {
    await cakeRelease.getLatestVersion();
    expect(core.warning).toHaveBeenCalledWith('Could not determine the latest version of Cake. getaddrinfo ENOTFOUND');
  });
});

describe('When failing to retrieve the latest Cake version with a GitHub token due to a network error', () => {
  let getJson: jest.SpyInstance;

  beforeAll(() => {
    getJson = jest.spyOn(http.HttpClient.prototype, 'getJson').mockRejectedValue(new Error('getaddrinfo ENOTFOUND'));
  });

  beforeEach(() => {
    getJson.mockClear();
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion('theToken')).toBeNull();
  });

  test('it should not retry the request', async () => {
    await cakeRelease.getLatestVersion('theToken');
    expect(getJson).toHaveBeenCalledTimes(1);
  });
});

describe('When failing to retrieve the latest Cake version due to an unexpected error', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockRejectedValue('something went wrong');
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });

  test('it should warn about the error', async () => {
    await cakeRelease.getLatestVersion();
    expect(core.warning).toHaveBeenCalledWith('Could not determine the latest version of Cake. something went wrong');
  });
});

describe('When failing to retrieve the latest Cake version due to an empty response from GitHub', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {},
      headers: {},
    });
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});

describe('When failing to retrieve the latest Cake version due to a missing tag name in the GitHub response', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {
        tag_name: null,
      },
      headers: {},
    });
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});

describe('When failing to retrieve the latest Cake version due to an empty tag name in the GitHub response', () => {
  beforeAll(() => {
    jest.spyOn(http.HttpClient.prototype, 'getJson').mockResolvedValue({
      statusCode: 200,
      result: {
        tag_name: '',
      },
      headers: {},
    });
  });

  test('it should return null', async () => {
    expect(await cakeRelease.getLatestVersion()).toBeNull();
  });
});
