export interface TabNode {
	tabId: number;
	title: string;
	url: string;
	favicon?: string;
	originTabId?: number;
	children?: TabNode[];
	status: "open" | "closed";
}
