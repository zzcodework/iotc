import { listTokens, getToken, createToken } from '../api/token';
import { getMachineName } from './file';

const codeId = getMachineName();

export async function connectToCentral(): Promise<void> {
    try {
        console.log(codeId);

        const tokens = await listTokens();
        console.log(tokens);

        let token = await getToken(codeId);
        if (!token) {
            token = await createToken(codeId);
        }

    }
    catch (e) {
        console.error(e);
    }
}