import db from '../../../db';

export default function UserMiddleware(request, reply, done) {
    if ('id' in request.params && !isNaN(Number(request.params.id))) {
        const userId = request.params.id;

        if (db.has('users/' + userId)) {
            request['user'] = {
                id: Number(userId),

                ...db.get('users/' + userId),
            };
        }
    }

    return done();
}
