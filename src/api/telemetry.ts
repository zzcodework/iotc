import { Client, Message } from 'azure-iot-device';
import { vscodeTemplate } from '../common/default';

const messageData = {
    Open: 1,
    Close: 2,
    File: 3,
    Line: 4,
    Time: Date.now()
};

const propertyData = {
    id: 'aaa',
    name: 'bbb',
    version: 'ccc'
};

export async function updateProperties(iothubClient: Client): Promise<void> {
    const message = new Message(JSON.stringify(messageData));
    message.contentType = 'application/json';
    message.properties.add('$.sub', vscodeTemplate.componentName);
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}

export async function updateTelemetries(iothubClient: Client): Promise<void> {
    const message = new Message(JSON.stringify({ 'Open': 111, 'Close': 222 }));
    message.contentType = 'application/json';
    message.properties.add('$.sub', vscodeTemplate.componentName);
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}
