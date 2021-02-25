import { Client } from 'azure-iot-device';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { Mqtt as DPSMqtt } from 'azure-iot-provisioning-device-mqtt';
import { Mqtt as IoTHubMqtt } from 'azure-iot-device-mqtt';
import { codeCredentials } from '../service/central';

export let iothubClient: Client;

export async function createDeviceByDps(deviceId: string): Promise<void> {
    iothubClient = await registerDevice(deviceId);
    console.log(iothubClient);
}

async function registerDevice(deviceId: string): Promise<Client> {
    const host = 'global.azure-devices-provisioning.net';
    const dpsTransport = new DPSMqtt();
    const securityClient = new SymmetricKeySecurityClient(deviceId, codeCredentials.symmetricKey.primaryKey);
    const dpsClient = ProvisioningDeviceClient.create(host, codeCredentials.idScope, dpsTransport, securityClient);

    return new Promise((resolve, reject) => {
        dpsClient.register((err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            if (result) {
                const connectionString = `HostName=${result.assignedHub};DeviceId=${result.deviceId};SharedAccessKey=${codeCredentials.symmetricKey.primaryKey}`;
                const iothubClient = Client.fromConnectionString(connectionString, IoTHubMqtt);
                iothubClient.open(err => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(iothubClient);
                    }
                });
            }
        });
    });
}