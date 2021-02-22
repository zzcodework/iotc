import { listTokens, getToken, createToken } from '../api/token';
import { getMachineName } from './file';

const codeId = getMachineName();

export async function connectToCentral(): Promise<void> {
    try {
        console.log(`VSCode id: ${codeId}`);

        const tokens = await listTokens();
        console.log(`List tokens: ${tokens.length}`);

        let token = await getToken(codeId);
        console.log(`Get existing token: ${token}`);

        if (!token) {
            token = await createToken(codeId);
            console.log(`Create new token: ${token}`);
        }
    }
    catch (e) {
        console.error(e);
    }
}