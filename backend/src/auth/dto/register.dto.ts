import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NICARAGUA_DEPARTMENTS } from '../../common/data/nicaragua-departments';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Ingrese sus nombres.' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres.' })
  @MaxLength(100)
  @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/, {
    message: 'Los nombres solo pueden contener letras.',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingrese sus apellidos.' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres.' })
  @MaxLength(100)
  @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/, {
    message: 'Los apellidos solo pueden contener letras.',
  })
  lastName: string;

  @IsEmail({}, { message: 'Ingrese un correo válido.' })
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingrese su teléfono.' })
  @Matches(/^(505\d{8}|1\d{10})$/, {
    message: 'Ingrese un teléfono válido de Nicaragua o USA.',
  })
  phone: string;

  @IsString()
  @IsIn([...NICARAGUA_DEPARTMENTS], {
    message: 'Seleccione un departamento válido.',
  })
  department: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingrese su municipio.' })
  @MinLength(2, { message: 'El municipio debe tener al menos 2 caracteres.' })
  @MaxLength(120)
  municipality: string;
}
