import axios from 'axios';
import { PerformanceObserver } from 'perf_hooks';
import { Roles, TokenResult } from '../common/types';
import { login } from '../service/login';

const oneHour = 1000 * 60 * 60;
const oneDay = oneHour * 24;
const oneMonth = oneDay * 30;
const subdomain = 'vscode';
let apiToken: TokenResult = {
    id: '',
    token: '',
    expiry: ''
};

export async function listTokens(): Promise<TokenResult[]> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens`, {
        headers: {
            authorization: value
        }
    });
    console.log(result.data.value);
    return result.data.value as TokenResult[];
}

export async function createToken(tokenId: string): Promise<TokenResult> {
    const value = await prepareAuthorizationHeader();
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
                authorization: value
            }
        }
    );
    console.log(result.data);
    const newToken = result.data as TokenResult;
    await setToken(newToken);
    return newToken;
}

export async function getToken(tokenId: string): Promise<TokenResult | null> {
    try {
        const value = await prepareAuthorizationHeader();
        const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`,
            {
                headers: {
                    authorization: value
                }
            });
        console.log(result.data);
        return result.data as TokenResult;
    }
    catch (e) {
        if (e.response.status === 404) {
            return null;
        }
        throw e;
    }
}

export async function deleteToken(tokenId: string): Promise<void> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.delete(`https://${subdomain}.azureiotcentral.com/api/preview/apiTokens/${tokenId}`,
        {
            headers: {
                authorization: value
            }
        });
    console.log(result.data);
    return result.data;
}

async function prepareAuthorizationHeader(): Promise<string> {
    if (apiToken && apiToken.token && apiToken.expiry) {
        const expiresOn = Date.parse(apiToken.expiry);
        const delta = expiresOn - Date.now();
        if (delta > oneMonth) {
            return apiToken.token;
        }
        else if (delta > oneDay) {
            // regenerate token
            return apiToken.token;
        }
    }
    const loginResult = await login();
    return `Bearer ${loginResult && loginResult.accessToken}`;
}

async function setToken(newToken: TokenResult) {
    apiToken = Object.assign(apiToken, newToken);
}