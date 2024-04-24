import { Post } from 'kenai/methods';
import { Body } from 'kenai/params';

import db from '../../../db';

export class SetUser {
    @Post()
    handler(@Body() data: object) {
        const id = getRandomNumber(1, 100);
        return {
            id,
            ...db.set('users/' + id, data),
        };
    }
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
