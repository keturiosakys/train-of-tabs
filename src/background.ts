import { TabNode } from "./types";
import { mapToObject, objectToMap } from "./utils";

function createTabNode(tab: chrome.tabs.Tab): TabNode | undefined {
  if (!tab.id) {
    return undefined;
  }

  return {
    tabId: tab.id,
    url: tab.url || "",
    title: tab.title || "",
    favicon: tab.favIconUrl || "",
    originTabId: tab.openerTabId,
    status: "open",
    children: [],
  };
}

const tabTree: Map<number, TabNode> = new Map();

chrome.runtime.onInstalled.addListener(async () => {
  try {
    // set up the initial tabTree

    const windows = await chrome.windows.getAll();

    for (const window of windows) {
      const tabs = await chrome.tabs.query({ windowId: window.id });
      for (const tab of tabs) {
        const currentTabNode = createTabNode(tab);

        if (currentTabNode && tab.id) {
          tabTree.set(tab.id, currentTabNode);

          if (tab.openerTabId) {
            const originTabNode = tabTree.get(tab.openerTabId);
            if (originTabNode) {
              // @ts-ignore - if the originTabNode exists, it will have children []
              originTabNode.children.push(currentTabNode);
              tabTree.set(tab.openerTabId, originTabNode);
            }
          }
        }
      }
    }

    await chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
  } catch (e) {
    console.error(e);
  }
  console.log("Train o'tabs extension installed. Choo choo...");
});

// chrome.tabs.onActivated.addListener(async (tabInfo) => {
//   const tab = await chrome.tabs.get(tabInfo.tabId);
//   if (!tab.id) {
//     return;
//   }
//   const activeTabNode: TabNode = {
//     tabId: tab?.id,
//     url: tab?.url || "",
//     title: tab?.title || "",
//     favicon: tab?.favIconUrl || "",
//     originTabId: tab?.openerTabId,
//     status: "open",
//   };
//
//   const tabTree = objectToMap(await chrome.storage.session.get("tabTree"));
//
//   tabTree.set(tab.id, activeTabNode);
//   chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
// });

chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) {
    return; // no id no fun
  }

  const createdTabNode: TabNode = {
    tabId: tab.id,
    url: tab.url || "",
    favicon: tab.favIconUrl || "",
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
  console.log("tabTree updated");
});

chrome.tabs.onUpdated.addListener(async (tabId, _changeInfo, tab) => {
  const tabNode = tabTree.get(tabId);

  if (tabNode) {
    tabNode.url = tab.url || "";
    tabNode.title = tab.title || "";
    tabNode.favicon = tab.favIconUrl || "";
    tabNode.originTabId = tab.openerTabId;
    tabTree.set(tabId, tabNode);
  }

  chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const tabNode = tabTree.get(tabId);

  if (tabNode) {
    tabNode.status = "closed";
    tabTree.set(tabId, tabNode);
    chrome.storage.session.set({ tabTree: mapToObject(tabTree) });
  }
});
