import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

const outputChannel = vscode.window.createOutputChannel("BrPrettyXAML");

export function activate(context: vscode.ExtensionContext) {
    
    let disposable = vscode.commands.registerCommand('brprettyxaml.run', (uri: vscode.Uri) => {
        
        let targetUri = uri;
        if (!targetUri && vscode.window.activeTextEditor) {
            targetUri = vscode.window.activeTextEditor.document.uri;
        }

        if (!targetUri) {
            vscode.window.showErrorMessage('BrPrettyXAML: Нет активного файла для обработки.');
            return;
        }

        const filePath = targetUri.fsPath;
        const scriptPath = path.join(context.extensionPath, 'runner.py');
        const command = `python "${scriptPath}" "${filePath}"`;

        outputChannel.clear();
        outputChannel.appendLine(`[Инфо] Запуск скрипта для файла: ${filePath}`);
        outputChannel.show(true);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                outputChannel.appendLine(`[Ошибка выполнения]: ${error.message}`);
                vscode.window.showErrorMessage(`BrPrettyXAML завершился с ошибкой. Подробности в панели вывода.`);
                return;
            }
            
            if (stderr && stderr.trim().length > 0) {
                outputChannel.appendLine(`[Предупреждение/Лог Python]:\n${stderr}`);
            }

            if (stdout && stdout.trim().length > 0) {
                outputChannel.appendLine(`[Вывод Python]:\n${stdout}`);
                vscode.window.showInformationMessage(`BrPrettyXAML: Файл успешно обработан.`);
            } else {
                outputChannel.appendLine(`[Инфо] Скрипт отработал, но ничего не вернул в stdout.`);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
