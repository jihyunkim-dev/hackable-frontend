// 백엔드가 로그인 결과(토큰)를 이 주소로 보내는 경우가 있어 콜백과 같은 처리를 쓴다.
// (현재 백엔드 결과 리다이렉트 주소: https://hackable.co.kr/auth/kakao)
export { GET } from "./callback/route";
