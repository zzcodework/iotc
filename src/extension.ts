// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { connectToCentral } from './service/central';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iotc" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.helloWorld',
		() => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from iotc!');
		}
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		'iotc.test',
		async () => {
			const result = await vscode.window.showInformationMessage('Test', 'Yes', 'No');
			if (result === 'Yes') {
				vscode.window.showInformationMessage('It is yes');
			}
			else {
				console.log('log no');
			}
		}
	));

	/**
	 * IoTCentral
	 * 1. Create api token and store locally
	 * 2. Provision a device/vscode instance
	 * 3. Send telemetry
	 * */
	connectToCentral();
}

// this method is called when your extension is deactivated
export function deactivate() { }
