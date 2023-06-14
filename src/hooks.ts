import { createSignal } from "solid-js";
import { TabNode } from "./types";
import { objectToMap } from "./utils";

export function useChromeStorage(key: string) {
	const [tabTree, setTabTree] = createSignal<Map<number, TabNode>>(new Map());

	chrome.storage.session.get(key, ({ tabTree }) => {
		if (tabTree) {
			setTabTree(objectToMap(tabTree));
		}
	});

	chrome.storage.session.onChanged.addListener((changes) => {
		if (changes.tabTree) {
			setTabTree(objectToMap(changes.tabTree.newValue));
		}
	});

	return [tabTree];
}
