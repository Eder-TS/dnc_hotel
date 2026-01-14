import { IsBoolean, IsNotEmpty } from 'class-validator';

interface ITokenPayload {
  name: string;
  sub: string;
  iat?: number;
  expiresIn?: number;
  issuer?: string;
  audience?: string;
}

export class AuthValidTokenDTO {
  @IsBoolean()
  @IsNotEmpty()
  valid: boolean;

  decoded?: ITokenPayload;
}
