#!/usr/bin/env node
/**
 * @file scripts/update-todo.ts
 * @description RE_TODO.md 파일 업데이트 스크립트
 *
 * 사용법:
 *   npx tsx scripts/update-todo.ts --task "작업명" --complete
 *   npx tsx scripts/update-todo.ts --date
 */

import { updateTodoCheckbox, updateTodoDate, readTodoFile } from "../lib/utils/todo-updater";

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
사용법:
  npx tsx scripts/update-todo.ts --task "작업명" --complete
  npx tsx scripts/update-todo.ts --task "작업명" --incomplete
  npx tsx scripts/update-todo.ts --date
  npx tsx scripts/update-todo.ts --read

옵션:
  --task "작업명"     업데이트할 작업명 (체크박스 앞의 텍스트)
  --complete          작업을 완료 상태로 변경 [X]
  --incomplete        작업을 미완료 상태로 변경 [ ]
  --date              업데이트 날짜를 오늘로 변경
  --read              파일 내용 읽기 (테스트용)
  --help              도움말 표시
`);
}

function main() {
  if (args.includes("--help") || args.length === 0) {
    showHelp();
    return;
  }

  if (args.includes("--read")) {
    try {
      const content = readTodoFile();
      console.log("✅ 파일 읽기 성공!");
      console.log(`파일 크기: ${content.length} 바이트`);
      console.log(`줄 수: ${content.split("\n").length}줄`);
    } catch (error) {
      console.error("❌ 파일 읽기 실패:", error);
      process.exit(1);
    }
    return;
  }

  if (args.includes("--date")) {
    try {
      updateTodoDate();
      console.log("✅ 날짜 업데이트 완료!");
    } catch (error) {
      console.error("❌ 날짜 업데이트 실패:", error);
      process.exit(1);
    }
    return;
  }

  const taskIndex = args.indexOf("--task");
  if (taskIndex === -1) {
    console.error("❌ --task 옵션이 필요합니다.");
    showHelp();
    process.exit(1);
  }

  const taskName = args[taskIndex + 1];
  if (!taskName) {
    console.error("❌ 작업명을 입력해주세요.");
    showHelp();
    process.exit(1);
  }

  const markComplete = args.includes("--complete");
  const markIncomplete = args.includes("--incomplete");

  if (!markComplete && !markIncomplete) {
    console.error("❌ --complete 또는 --incomplete 옵션이 필요합니다.");
    showHelp();
    process.exit(1);
  }

  try {
    updateTodoCheckbox(taskName, markComplete && !markIncomplete);
    console.log(`✅ "${taskName}" 작업이 ${markComplete ? "완료" : "미완료"}로 업데이트되었습니다!`);
  } catch (error) {
    console.error("❌ 작업 업데이트 실패:", error);
    process.exit(1);
  }
}

main();

