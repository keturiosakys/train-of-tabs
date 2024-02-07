import { createActiveElement } from "@solid-primitives/active-element";
import { createShortcut } from "@solid-primitives/keyboard";
import {
	For,
	Show,
	createEffect,
	createResource,
	createSignal,
} from "solid-js";
import { tabTree } from "../App";
import { TabNode } from "../types";
import { getCurrentTab } from "../utils";
import { CurrentTab, Tab } from "./Tab";

async function getNode(
	tab: chrome.tabs.Tab | undefined,
): Promise<TabNode | undefined> {
	const tree = tabTree();

	if (!tab || !tab.id) {
		return;
	}

	return tree.get(tab?.id);
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

			if (!currentTabNode()?.originTabId) {
				setOrigin(undefined);
				return;
			}

			try {
				const origin = await chrome.tabs.get(
					currentTabNode()?.originTabId as number,
				);
				setOrigin(await getNode(origin));
			} catch (_err) {
				setOrigin(undefined);
			}
		}
	});

	return (
		<div class="w-64 p-2">
			<Show when={currentTab()} fallback={<p>Loading...</p>}>
				<Show when={opened().length > 0 || origin() || currentTabNode()}>
					<Show when={origin()}>
						<section class="flex flex-col justify-center">
							<ul class="flex flex-col space-y-2">
								<Tab tab={origin()} />
							</ul>
						</section>
					</Show>

					<section>
						<ul class="flex flex-col space-y-2 pt-2">
							<CurrentTab tab={currentTabNode()} />
						</ul>
					</section>

					<Show when={opened().length > 0}>
						<section class={"flex flex-col justify-center pt-2"}>
							<ul class="flex flex-col space-y-2">
								<For each={opened()}>
									{(tab) => {
										if (tab.status === "open") return <Tab tab={tab} />;
									}}
								</For>
							</ul>
						</section>
					</Show>
				</Show>
			</Show>
		</div>
	);
}
