import * as crypto from 'crypto';
import { apiToken } from '../api/token';
import { login } from '../service/login';
import { oneDay, oneMonth } from './default';

export function computeDrivedSymmetricKey(masterKey: string, regId: string): string {
    return crypto.createHmac('SHA256', Buffer.from(masterKey, 'base64'))
        .update(regId, 'utf8')
        .digest('base64');
}

export async function prepareAuthorizationHeader(): Promise<string> {
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