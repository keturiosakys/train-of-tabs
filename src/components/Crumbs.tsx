import {
	createEffect,
	createResource,
	createSignal,
	For,
	Show,
} from "solid-js";
import { tabTree } from "../App";
import { TabNode } from "../types";
import { getCurrentTab } from "../utils";
import { Tab } from "./Tab";
import { createShortcut } from "@solid-primitives/keyboard";
import { createActiveElement } from "@solid-primitives/active-element";

async function getNode(tab: chrome.tabs.Tab) {
	//debugger;
	const tree = tabTree();
	const id = tab.id;

	if (!id) {
		return;
	}

	return tree.get(id);
}

export default function Crumbs() {
	const [currentTab] = createResource(getCurrentTab);
	const [tabNode] = createResource(currentTab, getNode);
	const [opened, setOpened] = createSignal<TabNode[]>([]);
	const [origin, setOrigin] = createSignal<TabNode>();

	const activeEl = createActiveElement();

	createShortcut(["Control", "N"], () => {
		(activeEl()?.nextElementSibling as HTMLElement)?.focus();
	});

	createShortcut(["ArrowDown"], () => {
		(activeEl()?.nextElementSibling as HTMLElement)?.focus();
	});

	createShortcut(["Control", "P"], () => {
		(activeEl()?.previousElementSibling as HTMLElement)?.focus();
	});

	createShortcut(["ArrowUp"], () => {
		(activeEl()?.previousElementSibling as HTMLElement)?.focus();
	});

	createEffect(async () => {
		if (tabNode()) {
			setOpened(tabNode()?.children || []);
			chrome.tabs.get(tabNode()?.originTabId as number, async (tab) =>
				setOrigin((await getNode(tab)) as TabNode),
			);
		}
	});

	return (
		<div class="w-64 p-2">
			<Show when={currentTab()} fallback={<p>Loading...</p>}>
				<Show
					when={opened().length > 0 || origin()}
					fallback={<p>Open some tabs to see something here...</p>}
				>
					<section class="flex flex-col justify-start">
						<Show when={origin()}>
							<p class="pb-2 font-bold">This tab opened from:</p>
							<ul class="flex flex-col space-y-2">
								<Tab tab={origin()} symbol="←" />
							</ul>
						</Show>
					</section>

					<Show when={opened().length > 0 && origin()}>
						<hr class="border-gray-300 my-4 mx-1" />
					</Show>

					<section class="flex flex-col justify-start">
						<Show when={opened().length > 0}>
							<p class="pb-2 font-bold">Tabs opened from here:</p>
							<ul class="flex flex-col space-y-2">
								<For each={opened()}>
									{(tab) => {
										if (tab.status === "open")
											return <Tab tab={tab} symbol="→" />;
									}}
								</For>
							</ul>
						</Show>
					</section>
				</Show>
			</Show>
		</div>
	);
}
