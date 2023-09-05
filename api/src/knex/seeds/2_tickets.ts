import type { Knex } from 'knex';
import type { Tickets } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export async function seed(knex: Knex): Promise<void> {
	try{	
		const ticketAmount = await knex('tickets').count({count: '*'}) 
		if(ticketAmount[0].count > 0) return;
		const eventIds = await knex('events').select('id');
		const tickets: Tickets[] = [];
  
		for (let i = 0; i < 100; i++) {
			const currentDate = new Date();
			const yesterday = new Date(currentDate);
			yesterday.setDate(yesterday.getDate() - 1);
  
			const randomEventIndex = Math.floor(Math.random() * eventIds.length);
			const randomEvent = eventIds[randomEventIndex];
			
			tickets.push({
				id: uuidv4(),
				eventId: randomEvent.id,
				barcode: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
			});
		}
		await knex('tickets').insert(tickets);
	}catch(e){
		console.warn(e);
	}
}