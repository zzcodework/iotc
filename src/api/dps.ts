import { Client, Message } from "azure-iot-device";
import { ProvisioningDeviceClient } from "azure-iot-provisioning-device";
import { ProvisioningPayload } from "azure-iot-provisioning-device/dist/interfaces";
import { SymmetricKeySecurityClient } from "azure-iot-security-symmetric-key";
import { subdomain, vscodeTemplate } from "../common/default";
import { computeDrivedSymmetricKey, prepareAuthorizationHeader } from "../common/util";
import { Mqtt as DPSMqtt } from 'azure-iot-provisioning-device-mqtt';
import { Mqtt as IoTHubMqtt } from 'azure-iot-device-mqtt';
import axios from "axios";
import { codeCredentials } from "../service/central";

const modelPayload = {
    types: {
        m3: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '__iot:interfaces': {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                CapabilityModelId: vscodeTemplate.capabilityModelId
            }
        }
    }
};

export async function createDeviceByDps(deviceId: string): Promise<void> {
    const iothubClient = await registerDevice(deviceId);
    iothubClient.emit(deviceId, 'values');
}

async function registerDevice(deviceId: string): Promise<Client> {
    const host = 'global.azure-devices-provisioning.net';
    const key = computeDrivedSymmetricKey(codeCredentials.symmetricKey.primaryKey, deviceId);
    const dpsTransport = new DPSMqtt();
    const securityClient = new SymmetricKeySecurityClient(deviceId, key);
    const dpsClient = ProvisioningDeviceClient.create(host, codeCredentials.idScope, dpsTransport, securityClient);
    const payload: ProvisioningPayload = modelPayload.types.m3;
    dpsClient.setProvisioningPayload(payload);

    return new Promise((resolve, reject) => {
        dpsClient.register((err, result) => {
            if (err) {
                console.log('Register DPS client failed.');
                reject(err);
            } else {
                const connectionString = `HostName=${result!.assignedHub};DeviceId=${result!.deviceId};SharedAccessKey=${key}`;
                const iothubClient = Client.fromConnectionString(connectionString, IoTHubMqtt);

                iothubClient.open(err => {
                    if (err) {
                        console.log('Open IoTHub client failed.');
                        reject(err);
                    } else {
                        setInterval(() => {
                            sendMessage(iothubClient);
                        },
                            3 * 1000);
                        resolve(iothubClient);
                    }
                });
            }
        });
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

export async function getDeviceCredentials(deviceId: string): Promise<any> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}/credentials`,
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}