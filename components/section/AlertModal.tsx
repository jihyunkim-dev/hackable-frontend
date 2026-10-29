"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { closeAlert, useAlertMessage } from "@/hooks/useAlertModal";

const CONFIRM_LABEL = "확인";

// 레이아웃에 하나 두는 공용 안내 모달. showAlert()로 연다. (hooks/useAlertModal)
// 다른 모달(삭제·탈퇴 확인 등) 위에서도 보이도록 한 단계 위(z-[70])에 띄운다.
export function GlobalAlertModal() {
  const alert = useAlertMessage();
  const lines = alert
    ? Array.isArray(alert.message)
      ? alert.message
      : [alert.message]
    : [];

  return (
    <Dialog.Root
      open={alert !== null}
      onOpenChange={(open) => !open && closeAlert()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50" />
        <Dialog.Content
          // 제목 없이 문구만 있으면 설명(Description)이 없으므로 연결하지 않는다.
          {...(!alert?.title && { "aria-describedby": undefined })}
          className="fixed top-1/2 left-1/2 z-[70] flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 rounded-xl bg-white px-6 pt-8 pb-6 text-center outline-none sm:w-[400px]"
        >
          <div className="flex flex-col gap-2">
            {/* 제목이 없으면 문구를 제목으로 읽게 한다. */}
            {alert?.title ? (
              <>
                <Dialog.Title className="text-label-l font-bold text-gray-800">
                  {alert.title}
                </Dialog.Title>
                <Dialog.Description className="text-body-m font-medium break-keep text-gray-500">
                  <MultiLine lines={lines} />
                </Dialog.Description>
              </>
            ) : (
              <Dialog.Title className="text-body-l font-medium break-keep text-gray-700">
                <MultiLine lines={lines} />
              </Dialog.Title>
            )}
          </div>
          <Dialog.Close asChild>
            <Button className="h-10 w-full max-w-[220px] text-body-m font-medium">
              {CONFIRM_LABEL}
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
