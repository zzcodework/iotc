import { listTokens, getToken, createToken } from '../api/token';
import { getMachineName } from './file';
import { login } from './login';

const codeId = getMachineName();

export async function connectToCentral(): Promise<void> {
    try {
        const tokens = await listTokens();
        let token = await getToken(codeId);
        if (!token) {
            token = await createToken(codeId);
        }
    }
    catch (e) {
        console.error(e);
    }
}