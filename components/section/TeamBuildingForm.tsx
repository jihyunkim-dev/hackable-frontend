"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useId, useState } from "react";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";

export interface TeamBuildingFormValues {
  title: string;
  body: string;
  imageUrl?: string;
  isOpen: boolean;
  position: string;
  deadline: string;
}

interface TeamBuildingFormProps {
  mode: "create" | "edit";
  cancelHref: string;
  defaultValues?: TeamBuildingFormValues;
}

const emptyValues: TeamBuildingFormValues = {
  title: "",
  body: "",
  isOpen: true,
  position: "",
  deadline: "",
};

// 팀빌딩 모집글 작성·수정 폼
// TODO: 등록/수정 API 연동 (현재는 입력 UI만 구현)
export default function TeamBuildingForm({
  mode,
  cancelHref,
  defaultValues = emptyValues,
}: TeamBuildingFormProps) {
  const content = teamBuildingContent.form;
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(defaultValues.isOpen);
  const [preview, setPreview] = useState(defaultValues.imageUrl);

  // 미리보기용 object URL은 바뀌거나 사라질 때 해제한다.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="mx-auto flex w-full max-w-[800px] flex-col gap-2.5 px-3 py-4 sm:gap-6 sm:px-8 sm:py-10"
    >
      <aside className="flex flex-col gap-2.5 rounded-lg bg-primary-50 p-3 sm:px-5">
        <p className="flex items-center gap-2 py-1 text-label-l text-primary-600 sm:text-heading-xs">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/70">
            <Image src={commonIconUrl.brandMark} alt="" width={13} height={20} />
          </span>
          {content.notice.title}
        </p>
        {content.notice.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="py-1 text-body-s whitespace-pre-line text-gray-700"
          >
            {paragraph}
          </p>
        ))}
      </aside>

      <input
        name="title"
        defaultValue={defaultValues.title}
        maxLength={content.titleMaxLength}
        placeholder={content.titlePlaceholder}
        aria-label={content.titlePlaceholder}
        className="w-full border-b border-gray-200 pb-2.5 text-heading-m text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-300"
      />

      <textarea
        name="body"
        defaultValue={defaultValues.body}
        placeholder={content.bodyPlaceholder}
        aria-label="모집 내용"
        rows={7}
        className="w-full resize-y text-body-l text-gray-800 outline-none placeholder:text-gray-600"
      />

      <label
        htmlFor={`${fieldId}-image`}
        className="relative flex h-56 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-gray-200 py-2 sm:h-[430px]"
      >
        {preview ? (
          <Image src={preview} alt="" fill unoptimized className="object-contain" />
        ) : (
          <>
            <Image src={commonIconUrl.imageAdd} alt="" width={64} height={64} />
            <span className="text-label-l text-gray-600 sm:text-heading-xs">
              {content.image.label}
            </span>
            <span className="text-body-s text-gray-400">
              {content.image.description}
            </span>
          </>
        )}
        <input
          id={`${fieldId}-image`}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
        />
      </label>
      {preview && (
        <button
          type="button"
          onClick={() => setPreview(undefined)}
          className="self-end text-label-m text-gray-500 underline"
        >
          {content.image.remove}
        </button>
      )}

      <div className="mt-16 flex items-center justify-between py-2 sm:mt-20">
        <span className="text-heading-s text-rose-500">{content.statusLabel}</span>
        <Switch
          checked={isOpen}
          onCheckedChange={setIsOpen}
          label={content.statusLabel}
          name="status"
        />
      </div>

      <Field
        id={`${fieldId}-position`}
        name="position"
        label={content.positionLabel}
        placeholder={content.positionPlaceholder}
        defaultValue={defaultValues.position}
      />
      <Field
        id={`${fieldId}-deadline`}
        name="deadline"
        label={content.deadlineLabel}
        placeholder={content.deadlinePlaceholder}
        defaultValue={defaultValues.deadline}
      />

      <div className="flex gap-4 border-t border-gray-200 pt-4 sm:justify-end">
        <Button
          asChild
          variant="secondary"
          className="h-10 flex-1 rounded-lg bg-gray-50 text-label-l text-black sm:w-24 sm:flex-none sm:text-heading-xs"
        >
          <Link href={cancelHref}>{content.cancel}</Link>
        </Button>
        <Button
          type="submit"
          className="h-10 flex-1 rounded-lg bg-rose-500 text-label-l hover:bg-rose-700 sm:w-24 sm:flex-none sm:text-heading-xs"
        >
          {mode === "create" ? content.submit : content.save}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="py-1.5 text-heading-s text-rose-500">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none text-body-l text-gray-800 outline-none placeholder:text-gray-600"
      />
    </div>
  );
}
