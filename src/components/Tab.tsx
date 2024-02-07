import { TabNode } from "../types";
import { setUpdated } from "./Train";

function handleTabClick(id: number) {
	chrome.tabs.update(id, { active: true });
	setUpdated(true);
}

export function CurrentTab(props: { tab: TabNode | undefined }) {
	const { tab } = props;
	return (
		<div class="rounded-xl group bg-gray-300 dark:bg-gray-600 opacity-75 py-2 px-4">
			<li class="text-left flex">
				<img
					class="w-4 h-4 align-middle mr-2"
					style="position: relative; top: 1px;"
					src={tab?.favicon}
					alt="tab favicon"
				/>
				<p class="truncate whitespace-nowrap">{tab?.title}</p>
			</li>
		</div>
	);
}

export function Tab(props: { tab: TabNode | undefined }) {
	const { tab } = props;
	if (!tab) {
		return undefined;
	}
	return (
		<button
			class="rounded-xl group hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 transition-colors opacity-75 py-2 px-4"
			type="button"
			onClick={() => handleTabClick(tab?.tabId as number)}
		>
			<li class="text-left flex">
				<img
					class="w-4 h-4 align-middle mr-2"
					style="position: relative; top: 1px;"
					src={tab?.favicon}
					alt="tab favicon"
				/>
				<p class="truncate whitespace-nowrap">{tab?.title}</p>
			</li>
		</button>
	);
}
