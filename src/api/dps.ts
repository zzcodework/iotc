import { Client, Message } from 'azure-iot-device';
import { ProvisioningDeviceClient } from 'azure-iot-provisioning-device';
import { ProvisioningPayload } from 'azure-iot-provisioning-device/dist/interfaces';
import { SymmetricKeySecurityClient } from 'azure-iot-security-symmetric-key';
import { vscodeTemplate } from '../common/default';
import { computeDrivedSymmetricKey } from '../common/util';
import { Mqtt as DPSMqtt } from 'azure-iot-provisioning-device-mqtt';
import { Mqtt as IoTHubMqtt } from 'azure-iot-device-mqtt';
import { codeCredentials } from '../service/central';

export async function createDeviceByDps(deviceId: string): Promise<void> {
    const iothubClient = await registerDevice(deviceId);
    // iothubClient.emit(deviceId, 'values');
}

async function registerDevice(deviceId: string): Promise<void> {
    const host = 'global.azure-devices-provisioning.net';
    const dpsTransport = new DPSMqtt();
    const securityClient = new SymmetricKeySecurityClient(deviceId, codeCredentials.symmetricKey.primaryKey);
    const dpsClient = ProvisioningDeviceClient.create(host, codeCredentials.idScope, dpsTransport, securityClient);

    dpsClient.register((err, result) => {
        if (err) {
            console.error(err);
        }
        if (result) {
            const connectionString = `HostName=${result.assignedHub};DeviceId=${result.deviceId};SharedAccessKey=${codeCredentials.symmetricKey.primaryKey}`;
            const iothubClient = Client.fromConnectionString(connectionString, IoTHubMqtt);
            iothubClient.open(err => {
                if (err) {
                    console.error(err);
                } else {
                    setInterval(() => {
                        sendMessage(iothubClient);
                    },
                        3 * 1000);
                }
            });
        }
    });
}

function sendMessage(iothubClient: Client) {
    const message = new Message('this is just a test message');
    iothubClient.sendEvent(message, (err, res) => {
        if (err) {
            console.error(err);
        }
        console.log(res);
    });
}
