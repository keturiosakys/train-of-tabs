export type Message = {
	type: "getTabNode" | "getTabTree";
};

export interface TabNode {
	tabId: number;
	title: string;
	url: string;
	originTabId?: number;
	children?: TabNode[];
	status: "open" | "closed";
}

