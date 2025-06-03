import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { saveSnapshot, loadSnapshot } from '../src/persistence';
import { MemoryStore } from '../src/store';

const SNAPSHOT_FILE = path.join(__dirname, '../data/snapshot.json');

describe('Persistence', () => {
  const store = new MemoryStore();

  beforeEach(() => {
    store.clear();
    if (fs.existsSync(SNAPSHOT_FILE)) {
      fs.unlinkSync(SNAPSHOT_FILE);
    }
  });

  afterEach(() => {
    if (fs.existsSync(SNAPSHOT_FILE)) {
      fs.unlinkSync(SNAPSHOT_FILE);
    }
  });

  it('saves and loads snapshot correctly', () => {
    store.set('foo', 'bar');
    store.set('count', '42');

    saveSnapshot(store.export());

    expect(fs.existsSync(SNAPSHOT_FILE)).toBe(true);

    const freshStore = new MemoryStore();
    const snapshot = loadSnapshot();
    expect(snapshot).not.toBeNull();

    freshStore.import(snapshot!);

    expect(freshStore.get('foo')).toBe('bar');
    expect(freshStore.get('count')).toBe('42');
  });

  it('returns null if no snapshot exists', () => {
    expect(loadSnapshot()).toBeNull();
  });
});
