import type { Hill } from './contour-hills';

const prefix = 'contour-terrain:v1:';

function isHill(value: unknown): value is Hill {
  if (!value || typeof value !== 'object') return false;
  const h = value as Partial<Hill>;
  return [h.x, h.y, h.radius, h.height, h.cos, h.sin, h.width, h.bend].every(Number.isFinite)
    && h.radius > 0 && h.width > 0
    && Array.isArray(h.path) && h.path.every(p => Number.isFinite(p?.x) && Number.isFinite(p?.y))
    && (h.color === undefined || (Array.isArray(h.color) && h.color.length === 3
      && h.color.every(channel => Number.isFinite(channel) && channel >= 0 && channel <= 1)));
}

export function loadTerrain(): Hill[] {
  const hills: Hill[] = [];
  try {
    const store = window.localStorage;
    const keys = Object.keys(store).filter(key => key.startsWith(prefix)).sort();
    for (const key of keys) {
      try {
        const hill: unknown = JSON.parse(store.getItem(key));
        if (isHill(hill)) hills.push(hill);
      } catch {
        // Recover the other strokes if this record is damaged.
      }
    }
  } catch {
    // Browsers can deny access to local storage. The terrain still works in memory.
  }
  return hills;
}

export function saveHill(hill: Hill) {
  try {
    // Separate records preserve edits made in other tabs and only write the new stroke.
    const key = prefix + Date.now() + ':' + Math.random().toString(36).slice(2);
    window.localStorage.setItem(key, JSON.stringify(hill));
  } catch (error) {
    console.warn('Could not save the terrain stroke to local storage.', error);
  }
}

export function clearStoredTerrain() {
  try {
    const store = window.localStorage;
    for (const key of Object.keys(store)) {
      if (key.startsWith(prefix)) store.removeItem(key);
    }
  } catch (error) {
    console.warn('Could not clear saved terrain from local storage.', error);
  }
}
