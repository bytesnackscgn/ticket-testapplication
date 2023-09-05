import React from 'react'; //
import Root from '../routes/Root';
import Tickets from "../routes/Tickets";
import Ticket from "../routes/Ticket";
import Events from "../routes/Events"
import Event from "../routes/Event";

export const routes = [
	{
		path: "/",
		element: React.createElement(Root)
	},
	{
		path: "/events",
		element: React.createElement(Events)
	},
	{
		path: "/events/:eventId",
		element: React.createElement(Event)
	},
	{
		path: "/tickets/:eventId",
		element: React.createElement(Tickets)
	},
	{
		path: "/tickets/:eventId/:ticketId",
		element: React.createElement(Ticket)
	},
];
