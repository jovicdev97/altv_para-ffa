import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfig(file) {
    const resourcePath = path.resolve(__dirname, '..');
    const filePath = path.join(resourcePath, file);
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}
