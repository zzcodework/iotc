export interface TokenResult {
    id: string;
    expiry: string;
    token: string;
}

export interface ArmToken {
    tenantId?: string;
    tokenType?: string;
    refreshToken?: string;
    accessToken: string;
    expiresIn: number;
    expiresOn?: string;
}

export enum Roles {
    administrator = 'ca310b8d-2f4a-44e0-a36e-957c202cd8d4',
    builder = '344138e9-8de4-4497-8c54-5237e96d6aaf',
    operator = 'ae2c9854-393b-4f97-8c42-479d70ce626e',
    dpsAttestation = 'dd2e81c9-e4f0-4cb7-9626-95b1b8ee9a15',
}