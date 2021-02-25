import * as vscode from 'vscode';
import { start, stop, test } from './service/central';
import { login } from './service/login';

export function activate(context: vscode.ExtensionContext) {

	// start();

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.start',
		async () => {
			const result = await vscode.window.showInformationMessage('Do you want to login to Azure and connect IoTCentral?', 'Yes', 'No');
			if (result === 'Yes') {
				await login();
				await start();
				vscode.window.showInformationMessage('Connected to IoTCentral application https://vscode.azureiotcentral.com');
			}
			else {
				console.log('log no');
			}
		}
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.stop',
		async () => {
			await stop();
			vscode.window.showInformationMessage('Stopped');
		}
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.test',
		async () => {
			await login();
			await test();
			vscode.window.showInformationMessage('Test telemetry sent to IoTCentral');
		}
	));
}

export function deactivate() {
	// stop();
}
