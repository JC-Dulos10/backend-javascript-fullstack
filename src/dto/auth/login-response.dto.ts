import { UserResponseDto } from "./user-response.dto";

export class LoginResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly user: UserResponseDto
  ) {}
}