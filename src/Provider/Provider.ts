import type { AiWriterOperationOptions } from '../api';
import type { message } from '../types';
import { InvalidPayloadError } from '@directus/errors';
import Prompts from '../prompts';
import { log } from 'directus:api';

export abstract class Provider {
	protected options: AiWriterOperationOptions;
	protected endpoint: string;
	protected apiKey: string;

	constructor(options: AiWriterOperationOptions, endpoint: string, apiKey: string) {
		if (!options.model) {
			throw new InvalidPayloadError({ reason: 'AI Model is missing' });
		}

		if (!options.text) {
			throw new InvalidPayloadError({ reason: 'Text is missing' });
		}

		this.options = options;
		this.endpoint = endpoint;
		this.apiKey = apiKey;
	}

	protected getMessages(): message[] {
		const messages = [] as message[];

		if (this.options.promptKey && this.options.promptKey in Prompts) {
			const prompt = Prompts[this.options.promptKey];

			if (prompt && prompt.messages) {
				messages.push(...prompt.messages);
			}
		}

		if (this.options.system) {
			messages.push({
				role: 'system',
				content: this.options.system,
			});
		}

		if (this.options.thread) {
			messages.push(...this.options.thread);
		}

		// Handle text and image content
		let userContent: any = [{ type: 'text', text: this.options.text || '' }];
		if (this.options.imageUrl) {
			userContent = [
				{ type: 'text', text: this.options.text! },
				{ type: 'image_url', image_url: { url: this.options.imageUrl } },
			];
		} else {
			userContent = this.options.text!;
		}

		messages.push({
			role: 'user',
			content: userContent,
		});

		log('OpenAI request body: ' + JSON.stringify(messages, null, 2));

		return messages;
	};

	public abstract messageRequest(): Promise<string>;
}
