import { TabNode } from "./types";
import { mapToObject } from "./utils";

export const tabTree: Map<number, TabNode> = new Map();

function createTabNode(tab: chrome.tabs.Tab): TabNode | undefined {
	if (!tab.id) {
		return undefined;
	}

	return {
		tabId: tab.id,
		url: tab.url || "",
		title: tab.title || "",
		originTabId: tab.openerTabId,
		status: "open",
		children: [],
	};
}

chrome.runtime.onInstalled.addListener(() => {
	console.log("Panko extension installed. Crushing bread now...");
});

chrome.tabs.onCreated.addListener(async (tab) => {
	if (!tab.id) {
		return; // no id no fun
	}

	const createdTabNode: TabNode = {
		tabId: tab.id,
		url: tab.url || "",
		title: tab.title || "",
		originTabId: tab.openerTabId,
		status: "open",
	};

	tabTree.set(tab.id, createdTabNode);

	if (tab.openerTabId) {
		const originTabNode =
			tabTree.get(tab.openerTabId) ??
			(createTabNode(await chrome.tabs.get(tab.openerTabId)) as TabNode);

		if (!originTabNode.children) {
			originTabNode.children = [];
		}

		originTabNode.children.push(createdTabNode);
		tabTree.set(tab.openerTabId, originTabNode);
	}

	chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
});

chrome.tabs.onUpdated.addListener(async (tabId, _changeInfo, tab) => {
	const tabNode = tabTree.get(tabId);

	if (tabNode) {
		tabNode.url = tab.url || "";
		tabNode.title = tab.title || "";
		tabNode.originTabId = tab.openerTabId;
		tabTree.set(tabId, tabNode);
	}

	chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
});

//chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
//});

chrome.tabs.onRemoved.addListener((tabId) => {
	const tabNode = tabTree.get(tabId);

	if (tabNode) {
		tabNode.status = "closed";
		tabTree.set(tabId, tabNode);
		chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
	}
});
