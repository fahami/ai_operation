export interface Prompt {
	text: string;
	value: string;
	icon: string;
	messages: message[];
}

export interface message {
	role: string;
	content: string | Array<TextContent | ImageContent>; // Improved type safety with specific multimodal content types
}

export interface TextContent {
	type: 'text';
	text: string;
}

export interface ImageContent {
	type: 'image_url';
	image_url: { url: string };
}

export type RequestBody = Record<string, any>;
