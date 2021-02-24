import * as vscode from 'vscode';
import { connectToCentral } from './service/central';
import { login } from './service/login';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.start',
		async () => {
			const result = await vscode.window.showInformationMessage('Do you want to login to Azure and connect IoTCentral?', 'Yes', 'No');
			if (result === 'Yes') {
				await login();
				await connectToCentral();
			}
			else {
				console.log('log no');
			}
		}
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.stop',
		() => {
			vscode.window.showInformationMessage('Stopped');
		}
	));
}

export function deactivate() { }
