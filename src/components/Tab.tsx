import { TabNode } from "../../types";
import { autofocus } from "@solid-primitives/autofocus";

function handleTabClick(id: number) {
	chrome.tabs.update(id, { active: true });
}

export function Tab(props: { tab: TabNode | undefined; symbol: string }) {
	const { tab, symbol } = props;
	return (
		<button
			class="rounded-lg group hover:bg-gray-200 focus-visible:bg-gray-200 transition-colors opacity-75 py-2 px-4"
			type="button"
			autofocus
			onClick={() => handleTabClick(tab?.tabId as number)}
		>
			<li class="text-left flex justify-between">
				<p class="truncate whitespace-nowrap">{tab?.title}</p>
				<span class="invisible group-focus-visible:visible group-hover:visible">
					{symbol}
				</span>
			</li>
		</button>
	);
}
