import { getDevice, getDeviceCredentials, putDevice } from '../api/device';
import { createDeviceByDps, iothubClient } from '../api/dps';
import { reportHealth, updateTelemetries, testTelemetries } from '../api/telemetry';
import { getToken, createToken } from '../api/token';
import { codeTemplate } from '../common/default';
import { Device, DeviceCredentials, MessageData } from '../common/types';
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
        const device = await createDevice();
        if (!device.provisioned || !iothubClient) {
            await provisionDevice();
        }
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
    console.log(token);
}

async function ensureSimDevice(): Promise<void> {
    const simInstanceId = `${codeId}-sim`;
    let instance = await getDevice(simInstanceId);
    if (!instance) {
        const device: Device = {
            id: simInstanceId,
            approved: true,
            instanceOf: codeTemplate.id,
            simulated: true
        };
        instance = await putDevice(device);
    }
}

async function provisionDevice(): Promise<void> {
    await createDeviceByDps(codeId);
}

async function createDevice(): Promise<Device> {
    let instance = await getDevice(codeId);
    if (!instance) {
        const device: Device = {
            id: codeId,
            approved: true,
            instanceOf: codeTemplate.id,
            simulated: false
        };
        instance = await putDevice(device);
    }
    console.log(instance);
    codeCredentials = await getDeviceCredentials(codeId);
    console.log(codeCredentials);
    return instance;
}

export async function health(): Promise<void> {
    setInterval(async () => {
        await reportHealth();
    },
        60 * 1000);
}

export async function start(): Promise<void> {
    await connectToCentral();
    await health();
    const msg: MessageData = {
        open: 1,
    };
    await updateTelemetries(msg);
}

export async function stop(): Promise<void> {
    await connectToCentral();
    const msg: MessageData = {
        close: 1
    };
    await updateTelemetries(msg);
}

export async function test(): Promise<void> {
    await connectToCentral();
    await testTelemetries();
}