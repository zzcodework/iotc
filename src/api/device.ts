import axios from "axios";
import { subdomain } from "../common/default";
import { Device, DeviceProperties } from '../common/types';
import { prepareAuthorizationHeader } from "../common/util";

export async function putDevice(device: Device): Promise<Device> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${device.id}`,
        {
            displayName: device.displayName,
            // description: device.description,
            instanceOf: device.instanceOf,
            simulated: device.simulated,
            approved: device.approved
        },
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function getDevice(deviceId: string): Promise<Device | null> {
    try {
        const value = await prepareAuthorizationHeader();
        const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}`,
            {
                headers: {
                    authorization: value
                }
            });
        return await result.data;
    }
    catch (e) {
        if (e.response.status === 404) {
            return null;
        }
        throw e;
    }
}

export async function putDeviceProperties(properties: DeviceProperties): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${properties.id}/properties`,
        {
            phoneInfo: {
                name: properties.name,
                image: properties.image,
                manufacturer: properties.manufacturer
            }
        },
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function getDeviceProperties(deviceId: string): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}/properties`,
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function getDeviceCloudProperties(deviceId: string): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}/cloudProperties`,
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function putDeviceCloudProperties(deviceId: string): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}/cloudProperties`,
        {
            tag: 'test'
        },
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function putDeviceComponentProperties(properties: DeviceProperties): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.put(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${properties.id}/components/${properties.componentName}/properties`,
        {
            name: properties.name,
            image: properties.image,
            manufacturer: properties.manufacturer
        },
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}

export async function getDeviceComponentProperties(deviceId: string, componentName: string): Promise<DeviceProperties> {
    const value = await prepareAuthorizationHeader();
    const result = await axios.get(`https://${subdomain}.azureiotcentral.com/api/preview/devices/${deviceId}/components/${componentName}/properties`,
        {
            headers: {
                authorization: value
            }
        });
    return await result.data;
}