import axios from 'axios';
import { Roles, TokenResult } from '../common/types';
import { login } from '../service/login';

const subdomain = 'vscode';
let apiToken: TokenResult = {
    id: '',
    token: '',
    expiry: ''
};

export async function listTokens(): Promise<TokenResult[]> {
    const armToken = await login();
    console.log(armToken.accessToken);
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens`, {
        headers: {
            authorization: `Bearer ${armToken.accessToken}`
        }
    });
    console.log(result.data);
    return result.data as TokenResult[];
}

export async function createToken(tokenId: string): Promise<TokenResult> {
    const armToken = await login();
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`,
        {
            roles: [
                {
                    role: Roles.builder
                }
            ]
        },
        {
            headers: {
                authorization: armToken.accessToken
            }
        }
    );
    console.log(result.data);
    apiToken = Object.assign(apiToken, result.data);
    return apiToken;
}


export async function getToken(tokenId: string): Promise<TokenResult> {
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`,
        {
            headers: {
                authorization: apiToken.token
            }
        });
    console.log(result.data);
    return result.data as TokenResult;
}