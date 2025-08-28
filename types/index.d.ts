import { z } from 'zod';

export type SafeZodType = Pick<z.ZodType, 'parse' | 'safeParse' | 'def'>;
