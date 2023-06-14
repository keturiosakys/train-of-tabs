export interface TabNode {
	tabId: number;
	title: string;
	url: string;
	originTabId?: number;
	children?: TabNode[];
	status: "open" | "closed";
}
