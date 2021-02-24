import axios from 'axios';
import { subdomain } from '../common/default';
import { Roles, TokenResult } from '../common/types';
import { prepareAuthorizationHeader } from '../common/util';

export let apiToken: TokenResult = {
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
    const newToken = result.data as TokenResult;
    setToken(newToken);
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
    return result.data;
}

function setToken(newToken: TokenResult): TokenResult {
    apiToken = Object.assign(apiToken, newToken);
    return apiToken;
}