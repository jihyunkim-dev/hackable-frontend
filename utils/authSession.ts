// 로그인 세션(토큰 쿠키) 관리. Route Handler(app/auth, app/api/auth)에서만 쓴다.
// 토큰은 httpOnly 쿠키에만 두어 브라우저 JS가 읽지 못하게 한다.
// (쿠키 저장·삭제는 Route Handler·Server Action에서만 할 수 있다)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AuthExpiredError,
  RequestRefreshToken,
  type TokenResponse,
} from "@/utils/requestToSrv";

export const AUTH_COOKIE = {
  access: "hk_access_token",
  refresh: "hk_refresh_token",
  // 로그인 후 돌아갈 페이지 (카카오·구글 로그인 왕복 동안만 쓴다)
  returnTo: "hk_return_to",
  // 로그인 여부 표시 (토큰 아님). 브라우저 JS가 읽을 수 있어, 새로고침 직후 /api/auth/me 응답 전에도
  // 헤더가 로그인 버튼을 잠깐 보여주지 않고 바로 프로필 아이콘을 그린다. (hooks/useAuth)
  hint: "hk_logged_in",
} as const;

// access_token은 백엔드에서 1시간 뒤 만료된다.
const ACCESS_MAX_AGE = 60 * 60;
// TODO: refresh_token 만료 기간 백엔드 확인 필요 (임시 14일)
const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;
const RETURN_TO_MAX_AGE = 60 * 10;

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function setAuthCookies(tokens: TokenResponse) {
  const store = await cookies();
  store.set(AUTH_COOKIE.access, tokens.access_token, {
    ...baseCookie,
    maxAge: ACCESS_MAX_AGE,
  });
  store.set(AUTH_COOKIE.refresh, tokens.refresh_token, {
    ...baseCookie,
    maxAge: REFRESH_MAX_AGE,
  });
  await setLoginHint();
}

// 로그인 여부 표시 쿠키. 이 표시만으로 로그인 처리하지 않는다. (실제 확인은 토큰으로)
export async function setLoginHint() {
  const store = await cookies();
  store.set(AUTH_COOKIE.hint, "1", {
    ...baseCookie,
    httpOnly: false,
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(AUTH_COOKIE.access);
  store.delete(AUTH_COOKIE.refresh);
  store.delete(AUTH_COOKIE.hint);
}

// 다른 사이트로 보내지 않도록 우리 사이트 안의 경로(/로 시작, //·/auth 제외)만 허용한다.
export function toSafeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/auth")) return "/";
  return value;
}

export async function setReturnTo(path: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE.returnTo, toSafeReturnPath(path), {
    ...baseCookie,
    maxAge: RETURN_TO_MAX_AGE,
  });
}

// 돌아갈 경로를 꺼내고 쿠키는 지운다.
export async function takeReturnTo(): Promise<string> {
  const store = await cookies();
  const path = toSafeReturnPath(store.get(AUTH_COOKIE.returnTo)?.value);
  store.delete(AUTH_COOKIE.returnTo);
  return path;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIE.refresh)?.value ?? null;
}

// 로그인이 필요한 요청을 보낸다.
// access_token으로 먼저 시도하고, 토큰이 없거나 만료(401)됐을 때만 refresh_token으로 한 번 재발급받아 다시 시도한다.
// 401이 아닌 실패(잘못된 입력 등)는 재발급하지 않고 그대로 null/false를 돌려준다.
// 재발급에 실패하거나 새 토큰도 401이면 로그인이 끝난 것으로 보고 쿠키를 지운다.
export async function withAuth<T>(
  request: (accessToken: string) => Promise<T>,
): Promise<T | null> {
  const store = await cookies();
  const accessToken = store.get(AUTH_COOKIE.access)?.value;

  if (accessToken) {
    try {
      return await request(accessToken);
    } catch (error) {
      if (!(error instanceof AuthExpiredError)) throw error;
    }
  }

  const refreshToken = store.get(AUTH_COOKIE.refresh)?.value;
  if (!refreshToken) return null;

  const tokens = await RequestRefreshToken(refreshToken);
  if (!tokens) {
    await clearAuthCookies();
    return null;
  }

  await setAuthCookies(tokens);
  try {
    return await request(tokens.access_token);
  } catch (error) {
    if (!(error instanceof AuthExpiredError)) throw error;
    await clearAuthCookies();
    return null;
  }
}

// 소셜 로그인(카카오·구글) 결과 처리. 백엔드가 결과를 쿼리로 붙여 보낸다.
// 성공: access_token·refresh_token·login_success=true → 쿠키에 저장하고 원래 페이지로 이동
// 실패: login_success=false·error=<코드>·message=<안내 문구> → 원래 페이지에서 안내 문구를 보여준다.
// (components/layout/header/HeaderClient)
export async function finishSocialLogin(
  params: URLSearchParams | null,
  origin: string,
): Promise<never> {
  const returnTo = await takeReturnTo();
  const accessToken = params?.get("access_token");
  const refreshToken = params?.get("refresh_token");

  if (params?.get("login_success") === "true" && accessToken && refreshToken) {
    await setAuthCookies({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
    });
    redirect(returnTo);
  }

  const failed = new URL(returnTo, origin);
  failed.searchParams.set(
    "login_error",
    params?.get("message") ?? "로그인에 실패했어요. 다시 시도해주세요.",
  );
  redirect(`${failed.pathname}${failed.search}`);
}
