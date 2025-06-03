import fs from 'fs';
import path from 'path';

const SNAPSHOT_FILE = path.join(__dirname, '../data/snapshot.json');

export function saveSnapshot(data: any): void {
  fs.mkdirSync(path.dirname(SNAPSHOT_FILE), { recursive: true });
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function loadSnapshot(): any | null {
  try {
    const content = fs.readFileSync(SNAPSHOT_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}
