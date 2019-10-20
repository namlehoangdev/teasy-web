import * as adminApis from './admin-apis';
import * as playgroundApis from './playground-apis';
import * as authApis from './auth-apis';
import * as userApis from './users-apis';

export default {...authApis, ...playgroundApis, ...userApis, ...adminApis};
