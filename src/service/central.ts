import { getDevice, getDeviceCredentials, putDevice } from '../api/device';
import { createDeviceByDps } from '../api/dps';
import { getToken, createToken } from '../api/token';
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
        await ensureSimDevice();
        await registerDevice();
        await provisionDevice();
        start();
    }
    catch (e) {
        console.error(e);
    }
}

async function ensureToken(): Promise<void> {
    let token = await getToken(codeId);
    if (!token) {
        token = await createToken(codeId);
    }
}

async function ensureSimDevice(): Promise<void> {
    const simInstanceId = `${codeId}-sim`;
    let instance = await getDevice(simInstanceId);
    if (!instance) {
        const device: Device = {
            id: simInstanceId,
            approved: true,
            instanceOf: vscodeTemplate.id,
            simulated: true
        };
        instance = await putDevice(device);
    }
}

async function provisionDevice(): Promise<void> {
    await createDeviceByDps(codeId);
}

async function registerDevice(): Promise<void> {
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
    codeCredentials = await getDeviceCredentials(codeId);
}

async function start(): Promise<void> {

}

async function stop(): Promise<void> {

}