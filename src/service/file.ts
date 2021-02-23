import * as os from 'os';

export function getMachineName(): string {
    let name = os.hostname().trim();
    name = name.replace('.', '');
    name = name.replace('-', '');
    name = name.replace(' ', '');
    return name;
}