import { registerAs } from '@nestjs/config';

// src/config/auth.config.ts
export const authConfig = registerAs('auth', () => ({
  auth: {
    github: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET_ID,
      login_redirect_url: process.env.GITHUB_LOGIN_REDIRECT_URL,
    },
    secretKey: process.env.SECRET_KEY,
    refreshToken: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
    accessToken: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
    redirect: process.env.LOGIN_REDIRECT_URL,
    openAiAPIKey: process.env.OPENAIAPI_KEY,
    kakao: {
      kakaoNativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
      kakaoRestApiKey: process.env.KAKAO_REST_API_KEY,
      kakakoJavascriptKey: process.env.KAKAO_JAVASCRIPT_KEY,
      kaKaoAdminKey: process.env.KAKAO_ADMIN_KEY,
      kakaoRedirectUri: process.env.KAKAO_REDIRECT_URI,
    },
    slack: {
      botUserOauthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
      appLevelToken: process.env.SLACK_APP_LEVEL_TOKEN,
      api: {
        lookupUserByEmail: process.env.SLACK_API_USERS_LOOKUPBYEMAIL_URI,
        postMessage: process.env.SLACK_API_CHAT_POSTMESSAGE_URI,
      },
      joinUrl: process.env.SLACK_API_JOIN_URL,
    },
    google: {
      project_id: process.env.GOOGLE_PROJECT_ID,
      access_token_auth: process.env.GOOGLE_ACCESS_TOKEN_AUTH,
    },
  },
}));
