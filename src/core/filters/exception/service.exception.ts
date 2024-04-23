// ENTITY_NOT_FOUND 값 객체(status, default-message)를 가진

import { CLIENT_ERROR, ENTITY_NOT_FOUND, ErrorCode } from './error-code';

//  ServiceException 인스턴스 생성 메서드
export const EntityNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
};

export const ClientErrorException = (message?: string): ServiceException => {
  return new ServiceException(CLIENT_ERROR, message);
};

export const ValidatationErrorException = (
  message?: string,
): ServiceException => {
  return new ServiceException(CLIENT_ERROR, message);
};

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}
