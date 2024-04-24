import { Get } from 'kenai/methods';
import { Cache } from 'kenai';

import { isValidUserId } from '../validations/user-id';
import { User } from '../../../decorators/user';
import db from '../../../db';

export class GetUser {
    @Cache({ cacheIn: 'memory' })
    @Get('/:id', {
        validations: [isValidUserId],
    })
    handler(@User() user: any) {
        return user;
    }
}
