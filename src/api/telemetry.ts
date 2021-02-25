import { Message } from 'azure-iot-device';
import { codeTemplate } from '../common/default';
import { MessageData, HealthData } from '../common/types';
import { randomNumber, randomStrings } from '../common/util';
import { iothubClient } from './dps';

export async function updateTelemetries(messageData: MessageData): Promise<void> {
    const message = new Message(JSON.stringify(messageData));
    message.contentType = 'application/json';
    message.properties.add('$.sub', codeTemplate.telemetryComponentName);
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}

export async function reportHealth(): Promise<void> {
    const healthData: HealthData = {
        status: randomStrings(5),
        heartbeat: randomNumber()
    };
    const message = new Message(JSON.stringify(healthData));
    message.contentType = 'application/json';
    message.properties.add('$.sub', codeTemplate.healthComponentName);
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}

export async function testTelemetries(): Promise<void> {
    const messageData: MessageData = {
        open: randomNumber(),
        close: randomNumber(),
        file: randomNumber(),
        line: randomNumber()
    };
    const message = new Message(JSON.stringify(messageData));
    message.contentType = 'application/json';
    message.properties.add('$.sub', codeTemplate.telemetryComponentName);
    const result = await iothubClient.sendEvent(message);
    console.log(result);
}