// src/common/exception/error-code/error.code.ts
class ErrorCodeVo {
  readonly status: string | number;
  readonly message: string;

  constructor(status: string | number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

// 아래에 에러코드 값 객체를 생성
// Create an error code instance below.
export const ENTITY_NOT_FOUND = new ErrorCodeVo(404, 'Entity Not Found');
export const CLIENT_ERROR = new ErrorCodeVo(
  400,
  'Client Error: 잘못된 값 입니다',
);

export const AUTHORIZATION_ERROR = new ErrorCodeVo(401, '인증오류');

export const ALREADY_EXIST_ERROR = new ErrorCodeVo(400, '이미 존재하는 값');
