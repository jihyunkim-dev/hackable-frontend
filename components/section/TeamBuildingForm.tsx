"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useId, useState } from "react";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import { teamBuildingContent } from "@/configs/contents/teamBuilding";
import { commonIconUrl } from "@/configs/urls";
import { useMe } from "@/hooks/useAuth";
import { openLoginModal } from "@/hooks/useLoginModal";
import { useSaveTeamBuilding } from "@/hooks/useMypage";
import { cn } from "@/lib/utils";
import { showAlert } from "@/hooks/useAlertModal";
import {
  TEAMBUILDING_CATEGORIES,
  type TeamBuildingCategory,
} from "@/utils/teamBuildingForm";
import {
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_TYPES,
  uploadImage,
} from "@/utils/imageUpload";

export interface TeamBuildingFormValues {
  // 비어 있으면 작성자가 고르게 한다. (카테고리가 생기기 전에 쓴 글도 비어 있다)
  category?: TeamBuildingCategory;
  title: string;
  body: string;
  imageUrl?: string;
  isOpen: boolean;
  position: string;
  // YYYY-MM-DD, 비우면 상시 모집
  deadline: string;
}

interface TeamBuildingFormProps {
  mode: "create" | "edit";
  cancelHref: string;
  // 수정할 글 id (mode가 edit일 때)
  teambuildingId?: string;
  defaultValues?: TeamBuildingFormValues;
}

const emptyValues: TeamBuildingFormValues = {
  title: "",
  body: "",
  isOpen: true,
  position: "",
  deadline: "",
};

// 팀빌딩 모집글 작성·수정 폼. 저장하면 상세 페이지로 이동한다.
export default function TeamBuildingForm({
  mode,
  cancelHref,
  teambuildingId,
  defaultValues = emptyValues,
}: TeamBuildingFormProps) {
  const content = teamBuildingContent.form;
  const router = useRouter();
  const { data: user } = useMe();
  const save = useSaveTeamBuilding(
    mode === "edit" ? teambuildingId : undefined,
  );
  const fieldId = useId();
  const [category, setCategory] = useState(defaultValues.category);
  const [isOpen, setIsOpen] = useState(defaultValues.isOpen);
  // 글자 수 표시용. 입력 제한은 maxLength가 막는다. (붙여넣기도 최대 길이까지만 들어간다)
  const [title, setTitle] = useState(defaultValues.title);
  const [body, setBody] = useState(defaultValues.body);
  // 화면에 보이는 이미지: 기존 이미지 주소 또는 새로 고른 파일의 미리보기(blob:)
  const [preview, setPreview] = useState(defaultValues.imageUrl);
  // 새로 고른 파일. 저장할 때 올린다. (고르기만 하고 나가면 올리지 않는다)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isSaving = isUploading || save.isPending;

  // 미리보기용 object URL은 바뀌거나 사라질 때 해제한다.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 일어나게 비운다.
    event.target.value = "";
    if (!file) return;
    if (!IMAGE_UPLOAD_TYPES.includes(file.type)) {
      showAlert(content.image.invalidType);
      return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
      showAlert(content.image.tooLarge);
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    // 페이지는 LoginGate로 막지만, 작성 중 로그인이 끝난 경우를 대비한다.
    if (!user) {
      openLoginModal();
      return;
    }
    if (!category) {
      showAlert(content.categoryRequired);
      return;
    }
    if (!title.trim()) {
      showAlert(content.titleRequired);
      return;
    }

    const form = new FormData(event.currentTarget);

    // 새로 고른 이미지가 있으면 먼저 올리고 그 주소를 글에 넣는다.
    let imageUrl = imageFile ? null : (preview ?? null);
    if (imageFile) {
      setIsUploading(true);
      try {
        imageUrl = await uploadImage(imageFile);
      } catch {
        showAlert(content.image.uploadError);
        return;
      } finally {
        setIsUploading(false);
      }
      // 다시 저장할 때 같은 파일을 또 올리지 않는다.
      setImageFile(null);
      setPreview(imageUrl);
    }

    save.mutate(
      {
        category,
        title,
        body,
        isOpen,
        position: String(form.get("position") ?? ""),
        deadline: String(form.get("deadline") ?? ""),
        imageUrl,
      },
      {
        onSuccess: (id) => router.push(`/teambuilding/${id}`),
        onError: () => showAlert(content.saveError),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[800px] flex-col gap-2.5 px-3 py-4 sm:gap-6 sm:px-8 sm:py-10"
    >
      <aside className="flex flex-col gap-2.5 rounded-lg bg-primary-50 p-3 sm:px-5">
        <p className="flex items-center gap-2 py-1 text-label-l text-primary-600 sm:text-heading-xs">
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/70">
            <Image
              src={commonIconUrl.brandMark}
              alt=""
              width={13}
              height={20}
            />
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

      <CategoryPicker value={category} onChange={setCategory} />

      <div className="flex flex-col gap-1">
        <input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={content.titleMaxLength}
          placeholder={content.titlePlaceholder}
          aria-label={content.titlePlaceholder}
          aria-describedby={`${fieldId}-title-count`}
          className="w-full border-b border-gray-200 pb-2.5 text-heading-m text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary-300"
        />
        <CharCount
          id={`${fieldId}-title-count`}
          length={title.length}
          max={content.titleMaxLength}
        />
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={content.bodyMaxLength}
          placeholder={content.bodyPlaceholder}
          aria-label="모집 내용"
          aria-describedby={`${fieldId}-body-count`}
          rows={7}
          className="w-full resize-y text-body-l text-gray-800 outline-none placeholder:text-gray-400"
        />
        <CharCount
          id={`${fieldId}-body-count`}
          length={body.length}
          max={content.bodyMaxLength}
        />
      </div>

      <label
        htmlFor={`${fieldId}-image`}
        className="relative flex h-56 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-gray-200 py-2 sm:h-[430px]"
      >
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            unoptimized
            className="object-contain"
          />
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
          accept={IMAGE_UPLOAD_TYPES.join(",")}
          onChange={handleImageChange}
          className="sr-only"
        />
      </label>
      {preview && (
        <button
          type="button"
          onClick={removeImage}
          disabled={isSaving}
          className="self-end text-label-m text-gray-500 underline"
        >
          {content.image.remove}
        </button>
      )}

      <div className="mt-16 flex items-center justify-between py-2 sm:mt-20">
        <span className="text-heading-s text-rose-500">
          {content.statusLabel}
        </span>
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
      {/* 마감일은 D-day 계산에 쓰여 날짜로 받는다. 비우면 상시 모집 */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${fieldId}-deadline`}
          className="py-1.5 text-heading-s text-rose-500"
        >
          {content.deadlineLabel}
        </label>
        <input
          id={`${fieldId}-deadline`}
          type="date"
          name="deadline"
          defaultValue={defaultValues.deadline}
          aria-describedby={`${fieldId}-deadline-hint`}
          className="w-full rounded-[8px] border border-gray-200 p-4 text-body-l text-gray-800 outline-none focus:border-primary-300"
        />
        <p
          id={`${fieldId}-deadline-hint`}
          className="text-body-s text-gray-500"
        >
          {content.deadlinePlaceholder}
        </p>
      </div>

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
          disabled={isSaving}
          className="h-10 flex-1 rounded-lg bg-rose-500 text-label-l hover:bg-rose-700 sm:w-24 sm:flex-none sm:text-heading-xs"
        >
          {mode === "create" ? content.submit : content.save}
        </Button>
      </div>
    </form>
  );
}

// 프로젝트/스터디 중 하나를 고른다. (라디오 버튼을 버튼 모양으로 보여 준다)
function CategoryPicker({
  value,
  onChange,
}: {
  value?: TeamBuildingCategory;
  onChange: (value: TeamBuildingCategory) => void;
}) {
  const labels = new Map(
    teamBuildingContent.categories.map((item) => [item.value, item.label]),
  );

  return (
    <fieldset className="flex items-center gap-3">
      <legend className="sr-only">
        {teamBuildingContent.form.categoryLabel}
      </legend>
      <span aria-hidden className="text-heading-s text-rose-500">
        {teamBuildingContent.form.categoryLabel}
      </span>
      {TEAMBUILDING_CATEGORIES.map((item) => (
        <label
          key={item}
          className={cn(
            "cursor-pointer rounded-full border px-4 py-1.5 text-label-l transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-200",
            value === item
              ? "border-rose-500 bg-rose-500 text-white"
              : "border-gray-200 text-gray-600 hover:border-gray-400",
          )}
        >
          <input
            type="radio"
            name="category"
            value={item}
            checked={value === item}
            onChange={() => onChange(item)}
            className="sr-only"
          />
          {labels.get(item)}
        </label>
      ))}
    </fieldset>
  );
}

// 입력 글자 수 / 최대 글자 수. 최대에 닿으면 빨간색으로 바뀐다.
function CharCount({
  id,
  length,
  max,
}: {
  id: string;
  length: number;
  max: number;
}) {
  return (
    <p
      id={id}
      className={cn(
        "self-end text-label-s text-gray-400 tabular-nums sm:text-label-m",
        length >= max && "text-destructive-300",
      )}
    >
      {length.toLocaleString()}/{max.toLocaleString()}
    </p>
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
        className="w-full resize-none text-body-l border border-gray-200 rounded-[8px] p-4 text-gray-800 outline-none placeholder:text-gray-600"
      />
    </div>
  );
}
