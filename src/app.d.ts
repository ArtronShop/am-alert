// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { UserInfoProps } from './types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			userInfo: UserInfoProps | null;
		}
	}
}

export {};
