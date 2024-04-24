import { createParamDecorator } from 'kenai';

export const User = (key?: string) => createParamDecorator('request/user', key);
