import {
  isEmail,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export enum SignInType {
  USERNAME = 'username',
  EMAIL = 'email',
  PHONE = 'phone',
}

export function getErrorMessageForType(type?: SignInType): string {
  switch (type) {
    case SignInType.EMAIL:
      return '找不到与该电子邮件地址关联的用户。';
    case SignInType.PHONE:
      return '找不到与该电话号码关联的用户。';
    case SignInType.USERNAME:
    default:
      return '找不到与该用户名关联的用户。';
  }
}

@ValidatorConstraint({ name: 'ConditionalEmail', async: false })
export class ConditionalEmailConstraint
  implements ValidatorConstraintInterface
{
  validate(account: string, args: ValidationArguments) {
    const object = args.object as SignInDto;
    return object.type === SignInType.EMAIL ? isEmail(account) : true;
  }

  defaultMessage() {
    return 'Account must be a valid email address when type is set to "email".';
  }
}

@ValidatorConstraint({ name: 'ConditionalPhoneNumber', async: false })
export class ConditionalPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(account: string, args: ValidationArguments) {
    const object = args.object as SignInDto;
    return object.type === SignInType.PHONE
      ? /^\+?[1-9]\d{1,14}$/.test(account)
      : true;
  }

  defaultMessage() {
    return 'Account must be a valid phone number when type is set to "phone".';
  }
}

export class SignInDto {
  @IsString()
  @Validate(ConditionalEmailConstraint, {
    message: 'Account must be a valid email address when type is email',
  })
  @Validate(ConditionalPhoneNumberConstraint, {
    message: 'Account must be a valid phone number when type is phone',
  })
  account: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(SignInType)
  type: SignInType;
}
