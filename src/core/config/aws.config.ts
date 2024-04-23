import { registerAs } from '@nestjs/config';

// src/config/aws.config.ts
export const awsConfig = registerAs('aws', () => ({
  aws: {
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    eventBridge: {
      target: {
        arn: process.env.AWS_EVENTBRIDGE_TARGET_ARN,
        roleArn: process.env.AWS_EVENTBRIDGE_TARGET_ROLE_ARN,
      },
    },
    congnito: {
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
      ClientSecretKey: process.env.AWS_CLIENT_SECRET_KEY,
      defaultPassword: process.env.AWS_COGNITO_DEFAULT_PASSWORD,
      redirectUrl: process.env.AWS_COGNITO_LOGIN_SUCCESS_REDIRECT_URL,
      authroity: process.env.AWS_COGNITO_AUTHORITY,
    },
  },
}));
