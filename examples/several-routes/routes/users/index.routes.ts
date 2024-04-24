import { Router } from 'kenai';

// Controllers
import * as Controllers from './controllers/';
import UserMiddleware from './validations/user';

@Router('/users', {
    controllers: Object.values(Controllers),
    validations: [UserMiddleware],
})
export default class UserRouter {}
