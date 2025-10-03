import * as core from '@actions/core';
import { isError, isString } from './guards';

export function setFailed(error: unknown) {
  if (isError(error)) {
    core.setFailed(error.message);
  } else if (isString(error)) {
    core.setFailed(error);
  } else {
    core.setFailed(String(error));
  }
}
