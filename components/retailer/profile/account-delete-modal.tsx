/**
 * @file components/retailer/profile/account-delete-modal.tsx
 * @description 회원 탈퇴 모달 (UI 전용, 실제 탈퇴 로직 미포함)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountDeleteModal() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState<string | undefined>();
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    // TODO: 실제 탈퇴 처리 로직을 연결하세요.
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 transition-colors"
        onClick={() => setOpen(true)}
      >
        회원 탈퇴
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">회원탈퇴</DialogTitle>
            <DialogDescription className="text-sm">
              정말로 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              주문이나 정산 내역이 있으면 탈퇴할 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>비밀번호 확인 *</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>탈퇴 사유 *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="탈퇴 사유를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">서비스 불만</SelectItem>
                  <SelectItem value="price">가격 불만</SelectItem>
                  <SelectItem value="etc">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>추가 설명 (선택)</Label>
              <Textarea
                placeholder="추가로 전달하고 싶은 내용이 있다면 입력해주세요"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              탈퇴하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


