"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import MultiLine from "@/components/ui/MultiLine";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { useDeleteTeamBuilding } from "@/hooks/useMypage";
import { showAlert } from "@/hooks/useAlertModal";

// 팀빌딩 상세의 삭제 버튼. 확인 모달에서 삭제하면 팀빌딩 목록으로 이동한다.
export default function TeamBuildingDeleteButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const content = teamBuildingContent.detail.delete;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteTeamBuilding(id);

  const handleDelete = () =>
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.replace("/teambuilding");
        // 목록으로 옮긴 뒤 브라우저가 들고 있던 화면을 새로 받는다. (지운 글이 목록에 남지 않게)
        router.refresh();
      },
      onError: () => showAlert(content.error),
    });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>{content.button}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white outline-none sm:w-[400px]">
          <div className="flex justify-end p-1">
            <Dialog.Close aria-label={content.close}>
              <Image
                src={commonIconUrl.close}
                alt=""
                width={40}
                height={40}
                className="size-7"
              />
            </Dialog.Close>
          </div>
          <div className="flex flex-col items-center gap-2 py-3 text-center">
            <Dialog.Title className="text-label-l font-bold text-gray-700">
              {content.title}
            </Dialog.Title>
            <Dialog.Description className="text-body-m font-medium text-gray-500">
              <MultiLine lines={content.description} />
            </Dialog.Description>
          </div>
          <div className="flex justify-center gap-2 px-7 py-2 pb-12">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                className="h-8 w-[104px] border-gray-300 text-body-m font-medium text-black hover:bg-gray-50"
              >
                {content.cancel}
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-8 w-[104px] bg-destructive-300 text-body-m font-medium hover:bg-destructive-500"
            >
              {content.submit}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
