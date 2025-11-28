/**
 * @file lib/utils/todo-updater.ts
 * @description RE_TODO.md 파일을 읽고 업데이트하는 유틸리티
 *
 * 작업 완료 시 RE_TODO.md 파일의 체크박스를 자동으로 업데이트합니다.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const TODO_FILE_PATH = join(process.cwd(), "docs", "retailer", "RE_TODO.md");

/**
 * RE_TODO.md 파일 읽기
 */
export function readTodoFile(): string {
  try {
    const content = readFileSync(TODO_FILE_PATH, "utf-8");
    console.log("✅ [TODO] RE_TODO.md 파일 읽기 성공");
    return content;
  } catch (error) {
    console.error("❌ [TODO] RE_TODO.md 파일 읽기 실패:", error);
    throw new Error(`RE_TODO.md 파일을 읽을 수 없습니다: ${error}`);
  }
}

/**
 * RE_TODO.md 파일 업데이트
 */
export function updateTodoFile(content: string): void {
  try {
    writeFileSync(TODO_FILE_PATH, content, "utf-8");
    console.log("✅ [TODO] RE_TODO.md 파일 업데이트 성공");
  } catch (error) {
    console.error("❌ [TODO] RE_TODO.md 파일 업데이트 실패:", error);
    throw new Error(`RE_TODO.md 파일을 업데이트할 수 없습니다: ${error}`);
  }
}

/**
 * 특정 체크박스를 완료 상태로 변경
 * @param searchText 찾을 텍스트 (체크박스 앞의 텍스트)
 * @param markComplete 완료 여부 (true: [X], false: [ ])
 */
export function updateTodoCheckbox(
  searchText: string,
  markComplete: boolean = true
): void {
  try {
    let content = readTodoFile();
    // 이스케이프 처리
    const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // 패턴 1: **텍스트** 형식 (예: - [ ] **내 정보 수정 페이지**)
    const pattern1 = new RegExp(
      `(- \\[)([ X])(\\] \\*\\*${escapedText}\\*\\*)`,
      "g"
    );
    
    // 패턴 2: 일반 텍스트 형식 (예: - [ ] 내 정보 수정 페이지)
    const pattern2 = new RegExp(
      `(- \\[)([ X])(\\] ${escapedText})`,
      "g"
    );

    const replacement = markComplete ? "$1X$3" : "$1 $3";
    let newContent = content.replace(pattern1, replacement);
    
    // 패턴 1에서 매칭되지 않으면 패턴 2 시도
    if (content === newContent) {
      newContent = content.replace(pattern2, replacement);
    }

    if (content !== newContent) {
      updateTodoFile(newContent);
      console.log(
        `✅ [TODO] "${searchText}" 체크박스 ${markComplete ? "완료" : "미완료"}로 업데이트됨`
      );
    } else {
      console.warn(`⚠️ [TODO] "${searchText}"를 찾을 수 없습니다`);
      console.log(`🔍 [TODO] 검색한 패턴: "${escapedText}"`);
      console.log(`🔍 [TODO] 파일 내용 샘플:`, content.substring(0, 500));
    }
  } catch (error) {
    console.error("❌ [TODO] 체크박스 업데이트 실패:", error);
    throw error;
  }
}

/**
 * RE_TODO.md 파일의 업데이트 날짜 변경
 */
export function updateTodoDate(): void {
  try {
    let content = readTodoFile();
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "-");
    const datePattern = /> \*\*업데이트:\*\* \d{4}-\d{2}-\d{2}/;
    const newDateLine = `> **업데이트:** ${today}`;

    if (datePattern.test(content)) {
      content = content.replace(datePattern, newDateLine);
      updateTodoFile(content);
      console.log(`✅ [TODO] 업데이트 날짜를 ${today}로 변경했습니다`);
    } else {
      console.warn("⚠️ [TODO] 업데이트 날짜 패턴을 찾을 수 없습니다");
    }
  } catch (error) {
    console.error("❌ [TODO] 날짜 업데이트 실패:", error);
    throw error;
  }
}

