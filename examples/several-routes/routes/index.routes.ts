import { Router } from 'kenai';

// Routers
import UserRouter from './users/index.routes';

@Router({
    routes: [UserRouter],
})
export default class MainRouter {}
