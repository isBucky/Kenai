import { Get } from 'kenai/methods';

import db from '../../../db';

export class ListUsers {
    @Get('/all')
    handler() {
        return db.get('/');
    }
}
