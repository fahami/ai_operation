import type { message } from './types';
/// <reference types="@directus/extensions/api.d.ts" />
import { defineOperationApi } from '@directus/extensions-sdk';
import { log } from 'directus:api';
import { getProvider } from './Provider/ProviderFactory';

export interface AiWriterOperationOptions {
	aiProvider?: string | null;
	apiKeyAnthropic?: string | null;
	apiKeyOpenAi?: string | null;
	apiKeyReplicate?: string | null;
	model?: string | null;
	promptKey?: string | null;
	system?: string | null;
	json_mode?: boolean;
	text?: string | null;
	imageUrl?: string | null; // Added for image input
	thread?: message[] | null;
	maxToken?: number | null;
}

export default defineOperationApi<AiWriterOperationOptions>({
	id: 'karyasa-ai-writer-operation',
	handler: async (options: AiWriterOperationOptions) => {
		try {
			const provider = getProvider(options);
			const message = await provider.messageRequest();

			return message;
		}
		catch (error: any) {
			throw new Error(`Analysis operation failed: ${error}`);
		}
	},
});
