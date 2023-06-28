import axios from 'axios';

const ID_NOT_EXISTS = Symbol('ID_NX');
const LENGTH_0 = Symbol('LENGTH_0');

export class ApiService {
  private readonly userObjectKeys = ['id', 'name', 'email', 'pw'] as const;
  async getPointToReduceAndTargetUserIdIfExistsOfGetAllMembersApi(
    url: string,
    tried = 0,
  ): Promise<{
    targetUserId: string | symbol;
    allMembersPointToReduce: number;
    allMembersReductionReasons: string[];
  }> {
    const path = new URL('/member', url).toString();
    const { data: responseBody, status } = await axios.get(path).catch((e) => ({
      data: e.response?.data ?? null,
      status: e.response?.status ?? null,
    }));

    if (status >= 400 && tried < 3)
      return this.getPointToReduceAndTargetUserIdIfExistsOfGetAllMembersApi(
        url,
        tried + 1,
      );
    const responseBodyExists = !!responseBody;
    const isStatus200 = status === 200;
    const isBodyLengthInAllowedRange =
      responseBody?.length >= 3 && responseBody?.length <= 99;
    const reductionReasons = [];

    !responseBodyExists &&
      reductionReasons.push('응답 본문이 존재하지 않습니다 (3점 감점)');

    responseBodyExists &&
      !isStatus200 &&
      reductionReasons.push(
        '모든 회원 조회의 응답 코드가 200이 아닙니다 (1점 감점)',
      );

    responseBodyExists &&
      !isBodyLengthInAllowedRange &&
      reductionReasons.push(
        '모든 회원 조회의 응답 본문 길이가 3보다 작거나 99보다 큽니다 (1점 감점)',
      );

    const isWrongElement =
      responseBodyExists &&
      Array.isArray(responseBody) &&
      responseBody.reduce((isWrong: boolean, member: any) => {
        if (isWrong) return isWrong;

        return this.userObjectKeys.reduce<boolean>((isWrong, key) => {
          if (isWrong) return isWrong;

          return member[key] ? false : true;
        }, false);
      }, false);

    isWrongElement &&
      reductionReasons.push(
        '모든 회원 조회의 응답 본문의 각각의 회원 정보에는 id, name, email, pw가 포함되어야 합니다 (1점 감점)',
      );

    const bodyLength = responseBody?.length ?? 0;

    return {
      targetUserId: bodyLength ? responseBody[0].id ?? ID_NOT_EXISTS : LENGTH_0,
      allMembersPointToReduce: responseBodyExists
        ? (!isStatus200 ? 1 : 0) +
          (!isBodyLengthInAllowedRange ? 1 : 0) +
          (isWrongElement ? 1 : 0)
        : 3,
      allMembersReductionReasons: reductionReasons,
    };
  }

  async getPointToReduceOfTargetMemberApi(
    url: string,
    userId: string | symbol,
    tried = 0,
  ): Promise<{
    targetMemberPointToReduce: number;
    targetMemberReductionReasons: string[];
  }> {
    if (typeof userId === 'symbol')
      return {
        targetMemberPointToReduce: 5,
        targetMemberReductionReasons: [
          `${
            userId === LENGTH_0
              ? '응답 본문의 배열이 존재하지 않았거나 배열의 길이가 0입니다'
              : '응답 본문에 배열과 요소가 존재하나 특정 유저 조회를 위해 선택된 유저에게 id가 존재하지 않습니다'
          }. 그러므로 유저조회를 할 수 없습니다. (5점 감점)`,
        ],
      };

    const path = new URL(`/member/${userId}`, url).toString();
    const { data: responseBody, status } = await axios.get(path).catch((e) => ({
      data: e.response?.data ?? null,
      status: e.response?.status ?? null,
    }));

    if (status >= 400 && tried < 3)
      return this.getPointToReduceOfTargetMemberApi(url, userId, tried + 1);

    const pointToReduce = this.userObjectKeys.reduce((reduction, key) => {
      return responseBody && responseBody[key] ? reduction : ++reduction;
    }, 0);
    const isStatus200 = status === 200;
    const reductionReasons = [];
    !isStatus200 &&
      reductionReasons.push(
        '특정 회원 조회의 응답 코드가 200이 아닙니다 (1점 감점)',
      );
    pointToReduce &&
      reductionReasons.push(
        `특정 회원 조회의 응답 본문에 ${pointToReduce}개의 필수 정보가 누락되었습니다 (${pointToReduce}점 감점)`,
      );
    // 총 5점 감점 가능
    return {
      targetMemberPointToReduce: (!isStatus200 ? 1 : 0) + pointToReduce,
      targetMemberReductionReasons: reductionReasons,
    };
  }

  async getPointToReduceOfExceptionHandling(url: string) {
    const randomString = Math.random().toString(36).substring(4);
    const expecting_400Path = new URL(
      `/member/${randomString}`,
      url,
    ).toString();

    const reductionReasons = [];

    const pointToReduce = await axios
      .get(expecting_400Path)
      .then(({ status }) => (status !== 400 ? 1 : 0))
      .catch((e) => (e?.response?.status !== 400 ? 1 : 0));

    pointToReduce &&
      reductionReasons.push(
        '존재하지 않는 회원 조회의 응답 코드가 400이 아닙니다 (1점 감점)',
      );

    return {
      exceptionHandlingPointToReduce: pointToReduce,
      exceptionHandlingReductionReasons: reductionReasons,
    };
  }
}
