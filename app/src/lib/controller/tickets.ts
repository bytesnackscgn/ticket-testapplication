import { FetchUtil } from '../utils/fetch';

export class TicketsController {
	private baseUrl: string; 
	constructor(url: string){
		this.baseUrl = `${url}/tickets`;
	}

	async createOne(payload: Record<string,unknown>, token?: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, '', payload, token);
		return await _fetch.post();
	}

	async updateOne(id: string, payload: Record<string,unknown>, token?: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, payload, token);
		return await _fetch.patch();
	}

	async readOne(id: string, token?: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, null, token);
		return await _fetch.get();
	}

	async readByQuery(query: Record<string,unknown>, token?: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, '', query, token);
		return await _fetch.get();
	}

	async deleteOne(id: string, token?: string) : Promise<unknown> {
		const _fetch = new FetchUtil(this.baseUrl, id, null, token);
		return await _fetch.delete();
	}
}