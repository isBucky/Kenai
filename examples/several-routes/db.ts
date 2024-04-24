import Database from 'bucky.db-local';

import NodePath from 'node:path';

export default new Database({
    directory: NodePath.resolve(process.cwd(), 'Database.json'),
});
