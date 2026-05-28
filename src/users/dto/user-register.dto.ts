import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsNotEmpty({ message: 'Password is required' })
	password: string;

	@IsNotEmpty({ message: 'Name is required' })
	name: string;
}
