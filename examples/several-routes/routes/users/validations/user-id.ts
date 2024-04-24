import db from '../../../db';

export function isValidUserId(request, reply, done) {
    if (!('id' in request.params) || isNaN(Number(request.params.id)))
        return done(new Error('The ID is malformed or incorrect'));

    if (!db.has('users/' + request.params.id))
        return done(new Error('This ID is invalid or does not exist'));

    return done();
}
