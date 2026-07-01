import { UserResponseDto } from "./user-response.dto";
export class AuthResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly user: UserResponseDto
  ) {}
}