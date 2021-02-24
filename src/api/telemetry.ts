import { Client, Message } from 'azure-iot-device';

const messageData = {
    open: 1,
    close: 2,
    file: 3,
    line: 4,
    time: Date.now()
};

const propertyData = {
    id: 'aaa',
    name: 'bbb',
    version: 'ccc'
};

export async function updateProperties(iothubClient: Client): Promise<void> {
    const message = new Message(JSON.stringify(messageData));
    message.contentType = 'application/json';
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}

export async function updateTelemetries(iothubClient: Client): Promise<void> {
    const message = new Message(JSON.stringify(messageData));
    message.contentType = 'application/json';
    message.properties.add('key', 'value');
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}
