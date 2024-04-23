import {
  CreateScheduleCommand,
  SchedulerClient,
  FlexibleTimeWindowMode,
  GetScheduleCommand,
} from '@aws-sdk/client-scheduler';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { awsConfig } from 'src/core/config/aws.config';
import { getAfterMonthDate } from 'src/core/utils/date';
import { useEventBridgeSchedulerSchedule } from 'src/core/utils/schedule';
import { User } from 'src/users/entities/user.entity';

export type EventBridgePutRoleParams = {
  StartDate: string | Date;
  EndDate: string | Date;
  Input?: {
    user: Partial<User> & { name: string };
  };
};

@Injectable()
export class EventBridgeService {
  private scheduler: SchedulerClient;

  constructor(
    @Inject(awsConfig.KEY)
    private config: ConfigType<typeof awsConfig>,
  ) {
    this.scheduler = new SchedulerClient({ region: config.aws.s3.region });
  }

  async register(user: User) {
    const { getScheduleTemplate } = useEventBridgeSchedulerSchedule(
      user.accessToken,
      user,
    );

    return await this.putRule({
      StartDate: new Date(),
      EndDate: getAfterMonthDate(12),
      Input: { ...getScheduleTemplate(), user },
    });
  }

  async getRule(userName: string) {
    const command = new GetScheduleCommand({
      Name: `SYSTEM-USER-${userName}-Rules`,
    });

    const response = await this.scheduler.send(command).catch((err) => {
      if (err.$metadata.httpStatusCode === 404) {
        return null;
      }
    });

    return response;
  }

  putRule = async ({ EndDate, StartDate, Input }: EventBridgePutRoleParams) => {
    const command = new CreateScheduleCommand({
      Name: `SYSTEM-USER-${Input.user.name}-Rules`,
      GroupName: 'default',
      ScheduleExpression: `cron(* 5 * * ? *)`,
      FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.FLEXIBLE,
        MaximumWindowInMinutes: 15,
      },
      ScheduleExpressionTimezone: 'Asia/Seoul',
      Target: {
        Arn: this.config.aws.eventBridge.target.arn,
        RoleArn: this.config.aws.eventBridge.target.roleArn,
        Input: JSON.stringify(Input),
      },
      StartDate: new Date(StartDate),
      EndDate: new Date(EndDate),
    });

    const response = await this.scheduler.send(command).catch((err) => {
      return err.message;
    });

    return response;
  };
}
