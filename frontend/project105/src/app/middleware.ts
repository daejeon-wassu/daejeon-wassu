// // app/middleware.ts
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// // 로그인 여부를 확인하는 미들웨어 함수
// export function middleware(request: NextRequest) {
//   // 쿠키에서 'authToken'을 가져옵니다.
//   const token = request.cookies.get("authToken");

//   // 토큰이 없으면, 로그인 페이지로 리디렉션
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 토큰이 존재하면 요청을 계속 진행
//   return NextResponse.next();
// }

// // 미들웨어가 적용될 경로를 설정합니다.
// export const config = {
//   matcher: ["/main"], // 보호할 페이지 경로
// };
