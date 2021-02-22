import * as os from 'os';

export function getMachineName(): string {
    return os.hostname();
}