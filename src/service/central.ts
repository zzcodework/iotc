import { getDevice, putDevice } from '../api/device';
import { getDeviceCredentials } from '../api/dps';
import { listTokens, getToken, createToken } from '../api/token';
import { vscodeTemplate } from '../common/default';
import { Device, DeviceCredentials } from '../common/types';
import { getMachineName } from './file';

export const codeId = getMachineName();
export let codeCredentials: DeviceCredentials = {
    idScope: '',
    symmetricKey: {
        primaryKey: '',
        secondaryKey: ''
    }
};

export async function connectToCentral(): Promise<void> {
    try {
        await ensureToken();
        await ensureDevice();
        start();
    }
    catch (e) {
        console.error(e);
    }
}

async function ensureToken(): Promise<void> {
    const tokens = await listTokens();
    console.log(`List ${tokens.length} tokens from vscode application`);

    let token = await getToken(codeId);
    if (!token) {
        token = await createToken(codeId);
    }
    console.log(token);
}

async function ensureDevice(): Promise<void> {
    let instance = await getDevice(codeId);
    if (!instance) {
        const device: Device = {
            id: codeId,
            approved: true,
            instanceOf: vscodeTemplate.id,
            simulated: false
        };
        instance = await putDevice(device);
    }

    codeCredentials = await getDeviceCredentials(instance.id);
    console.log(codeCredentials);
}

async function start(): Promise<void> {

}

async function stop(): Promise<void> {

}