import { interactiveLoginWithAuthResponse, AuthResponse, UserTokenCredentials, InteractiveLoginOptions } from '@azure/ms-rest-nodeauth';
import { time } from 'console';
import { ArmToken } from '../common/types';

let armToken: ArmToken = {
    accessToken: '',
    expiresIn: 0
};

export async function login(): Promise<ArmToken> {
    if (armToken && armToken.accessToken && armToken.expiresIn) {
        if (armToken.expiresIn > 60 * 30) {
            return armToken;
        }
    }

    try {
        const options: InteractiveLoginOptions = {
            domain: 'microsoft.onmicrosoft.com',
            tokenAudience: 'https://apps.azureiotcentral.com'
        };

        const response = await interactiveLoginWithAuthResponse(options) as AuthResponse;
        const credentials = response.credentials as UserTokenCredentials;

        if (credentials) {
            if (credentials.tokenCache) {
                const tokenArray = Object.values(credentials.tokenCache);
                if (tokenArray.length > 0) {
                    const tokenOjb = tokenArray[0];
                    const objArray = Object.values(tokenOjb);
                    if (objArray.length > 0) {
                        const token = objArray[0];
                        armToken = Object.assign(armToken, token);
                    }
                }
            }
        }
    }
    catch (e) {
        console.error(e);
    }

    return armToken;
}