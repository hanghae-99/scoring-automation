import loadData from "./function/fs/write.scoring.completed.js";
/**
 * @entrypoint
 */
async function main() {
  /**
   * @description
   * CLI나 호출 등 모든 의존성 한번에 실행 하는 지점
   */
  loadData();
}

main();
