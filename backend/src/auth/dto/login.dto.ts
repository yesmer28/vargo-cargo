import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Ingrese su teléfono.' })
  @Matches(/^(505\d{8}|1\d{10})$/, {
    message: 'Ingrese un teléfono válido de Nicaragua o USA.',
  })
  phone: string;
}
