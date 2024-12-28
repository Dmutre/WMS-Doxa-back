import { ValidateIf, ValidateBy } from 'class-validator';

export const IsNullable = () => ValidateIf((_, value) => value !== null);

export const IsDateDivisibleBy = (divisor: number) =>
  ValidateBy({
    name: 'isDateDivisibleBy',
    async: false,
    validator: {
      validate(value: unknown) {
        return value instanceof Date && value.getTime() % divisor === 0;
      },
      defaultMessage() {
        return `$property must be a date divisible by ${divisor}`;
      },
    },
  });
