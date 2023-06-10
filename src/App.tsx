import {
	Component,
	createResource,
	createSignal,
	For,
	Show,
} from "solid-js";
import { TabNode } from "./types";

async function getTabs() {
	const { tabTree } = (await chrome.storage.local.get(["tabTree"])) as {
		tabTree: TabNode[];
	};

	return tabTree;
}

async function getCurrentTab() {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});

	return tab;
}

const App: Component = () => {
	const [tabs, setTabs] = createSignal<TabNode[]>([]);
	const [currentTab] = createResource(getCurrentTab);
	const [tabTree] = createResource(getTabs);

	const getNode = (id: chrome.tabs.Tab["id"]) => {
		if (!tabTree()) {
			return;
		}
		const node = tabTree()?.find((node) => node.tabId === id);
		return node;
	};


	const tabNode = getNode(currentTab()?.id);
	console.log("tabNode", tabNode);

	return (
		<div class="w-64 p-2">
			<Show when={currentTab()} fallback={<p>Loading...</p>}>
				<section class="flex flex-col justify-start">
					<p class="pb-2 font-bold">I came from here...</p>
					<ul class="flex flex-col space-y-2">
						<a class="rounded-lg" href="#">
							<li class="bg-gray-200 hover:bg-gray-100 transition-colors opacity-75 py-2 px-4 rounded-lg">
								Tab 2
							</li>
						</a>
					</ul>
				</section>

				<hr class="border-gray-300 my-4 mx-1" />

				<section class="flex flex-col justify-start">
					<p class="pb-2 font-bold">I opened these ...</p>
					<ul class="flex flex-col space-y-2">
						<For each={tabs()}>
							{(tab) => (
								<a class="rounded-lg" href={tab.url}>
									<li class="bg-gray-200 hover:bg-gray-100 transition-colors opacity-75 py-2 px-4 rounded-lg">
										{tab.title}
									</li>
								</a>
							)}
						</For>
					</ul>
				</section>
			</Show>
		</div>
	);
};

export default App;
