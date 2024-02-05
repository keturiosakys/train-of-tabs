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
import { Tab, CurrentTab } from "./Tab";
import { createShortcut } from "@solid-primitives/keyboard";
import { createActiveElement } from "@solid-primitives/active-element";

async function getNode(tab: chrome.tabs.Tab) {
	const tree = tabTree();
	const id = tab.id;

	if (!id) {
		return;
	}

	return tree.get(id);
}
export const [updated, setUpdated] = createSignal<boolean>(false);

export default function Train() {
	const [currentTab] = createResource(getCurrentTab);
	const [currentTabNode] = createResource(currentTab, getNode);
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
		updated();
		if (currentTabNode()) {
			setOpened(currentTabNode()?.children || []);
			chrome.tabs.get(currentTabNode()?.originTabId as number, async (tab) =>
				setOrigin((await getNode(tab)) as TabNode),
			);
		}
	});


	return (
		<div class="w-64 p-2">
			<Show when={currentTabNode()} fallback={<p>Loading...</p>}>
				<Show
					when={opened().length > 0 || origin() || currentTabNode()}
				>
					<section class="flex flex-col justify-center">
						<Show when={origin()}>
							<ul class="flex flex-col space-y-2">
								<Tab tab={origin()} />
							</ul>
						</Show>
					</section>

					<section>
						<ul class="flex flex-col space-y-2 py-2">
							<CurrentTab tab={currentTabNode()} />
						</ul>
					</section>

					<section class="flex flex-col justify-center">
						<Show when={opened().length > 0}>
							<ul class="flex flex-col space-y-2">
								<For each={opened()}>
									{(tab) => {
										if (tab.status === "open")
											return <Tab tab={tab} />;
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
