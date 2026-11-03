"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { newsletterUnsubscribeContent } from "@/configs/contents/newsletter";

type Status = "idle" | "submitting" | "done" | "invalid" | "error";

// 메일 보안 검사기가 링크를 미리 열어도 해지되지 않도록, 버튼을 눌러야 수신 거부한다.
export function NewsletterUnsubscribeForm() {
  const content = newsletterUnsubscribeContent;
  const token = useSearchParams().get("token")?.trim() ?? "";
  const [status, setStatus] = useState<Status>(token ? "idle" : "invalid");

  const handleUnsubscribe = async () => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setStatus("done");
      else
        setStatus(
          res.status === 404 || res.status === 400 ? "invalid" : "error",
        );
    } catch {
      setStatus("error");
    }
  };

  if (status === "done" || status === "invalid") {
    return (
      <p
        aria-live="polite"
        className="p-2.5 text-center text-heading-s font-bold text-gray-800"
      >
        {status === "done" ? content.done : content.invalid}
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center gap-5 text-center">
      <h1 className="p-2.5 text-heading-s font-bold break-keep text-gray-800">
        {content.title}
      </h1>
      {status === "error" && (
        <p
          role="alert"
          className="text-body-s font-medium text-destructive-300"
        >
          {content.error}
        </p>
      )}
      <Button
        type="button"
        onClick={handleUnsubscribe}
        disabled={status === "submitting"}
        aria-busy={status === "submitting" || undefined}
        className="h-10 w-full rounded-sm text-label-m font-bold disabled:bg-gray-200 disabled:text-gray-500"
      >
        {status === "submitting" ? content.submitting : content.submit}
      </Button>
    </div>
  );
}
