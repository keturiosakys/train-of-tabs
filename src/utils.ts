import { TabNode } from "./types";

export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
}


// Convert Map to plain object before setting it to session storage
export function mapToObject(
  map: Map<number, TabNode>,
): Record<number, TabNode> {
  const obj: Record<number, TabNode> = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}

// Convert plain object back to Map after getting it from session storage
export function objectToMap(
  obj: Record<number, TabNode>,
): Map<number, TabNode> {
  const map = new Map<number, TabNode>();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      map.set(Number(key), obj[key]);
    }
  }
  return map;
}
