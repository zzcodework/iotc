import axios from 'axios';
import { TokenResult } from '../common/types';

const subdomain = 'vscode';
const zzToken = 'SharedAccessSignature sr=24dce127-0fa8-435a-8f36-465c42efb14c&sig=P0tR%2FABzibmApeb7UyNnoyfBovnHiIPBgnGKvM60Cws%3D&skn=zz&se=1645556100510';

export async function listTokens(): Promise<TokenResult[]> {
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens`, {
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Authorization': zzToken
        }
    });
    return result.data;
}

export async function createToken(tokenId: string): Promise<TokenResult> {
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`, {
        "roles": [
            {
                "role": "ca310b8d-2f4a-44e0-a36e-957c202cd8d4" // admin
            }
        ]
    });

    return result.data as TokenResult;
}


export async function getToken(tokenId: string): Promise<TokenResult> {
    let result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`);
    return result.data as TokenResult;
}