import { Message, TabNode } from "./types";

export const tabTree: TabNode[] = [];

chrome.runtime.onInstalled.addListener(() => {
	console.log("Breadcrumbs extension installed");
});

chrome.tabs.onCreated.addListener((tab) => {
	if (!tab.id) {
		return; // no id no fun
	}

	const tabNode: TabNode = {
		tabId: tab.id,
		url: tab.url || "",
		title: tab.title || "",
		originTabId: tab.openerTabId,
		status: "open",
	};

	const originTabNode = tabTree.find((node) => node.tabId === tab.openerTabId);

	if (originTabNode) {
		if (!originTabNode.children) {
			originTabNode.children = [];
		}

		originTabNode.children.push(tabNode);
	}

	console.log("Tab created", tabNode);

	tabTree.push(tabNode);
	chrome.storage.local.set({ tabTree });
});

chrome.tabs.onRemoved.addListener((tabId) => {
	const tabNode = tabTree.find((node) => node.tabId === tabId);

	if (tabNode) {
		tabNode.status = "closed";
	}
	console.log("Tab removed", tabNode);
});

chrome.runtime.onMessage.addListener(
	(message: Message, sender, sendResponse) => {
		console.log("Message received", message);
		console.log("Sender", sender);
		console.log(tabTree);
		if (!sender?.tab?.id) {
			sendResponse("NoTabId"); // signal that the extension must be opened in a tab
		}

		if (message.type === "getTabNode") {
			const tabNode = tabTree.find((node) => node.tabId === sender?.tab?.id);
			sendResponse(tabNode);
		}

		if (message.type === "getTabTree") {
			sendResponse(tabTree);
		}
	},
);
