import { EventsController } from './events';
import { TicketsController } from './tickets';

export class CMS {
	events;
	tickets;

	constructor(url: string){
		this.events = new EventsController(url);
		this.tickets = new TicketsController(url);
	}
}