import { Delete } from 'kenai/methods';
import { Params } from 'kenai/params';
import { Cache } from 'kenai';

import { isValidUserId } from '../validations/user-id';
import db from '../../../db';

export class DeleteUser {
    @Cache.Delete('memory')
    @Delete('/:id', {
        validations: [isValidUserId],
    })
    handler(@Params('id') userId: string) {
        return db.delete('users/' + userId);
    }
}
