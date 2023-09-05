import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import { useGlobal } from '../context/global';
import TableOptions from '../components/TableOptions';
import type { Tickets, Events } from '../../types'
import { EventsController } from '../lib/controller/events';
import { TicketsController } from '../lib/controller/tickets';

export default function Tickets() {
	const { eventId } = useParams();
	const { cms } = useGlobal() as unknown as { cms: { events: EventsController, tickets: TicketsController }};

	const [tickets, setTickets] = useState([] as Tickets[]);
	const [event, setEvent] = useState({} as Events);

	const fetchEvent = async () => {
		try {
			const res = await cms.events.readOne(eventId as string);
			setEvent(res as Events);
		} catch (error) {
			console.error('Error fetching Event data:', error);
		}
	};

	const fetchData = async () => {
		try {
			const res = await cms.tickets.readByQuery({
				sort: 'firstName',
				filter: {
					_and: [
						{
							eventId: {
								_eq: eventId,
							},
						},
					],
				},
			});

			setTickets(res as Tickets[]);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchEvent();
		fetchData();
	}, []);

	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				mb={3}
			>
				<h3>
					{event.title} in {event.city}
				</h3>
				<Link to="/events">
					<Button variant="contained">Back to Events</Button>
				</Link>
				<Link to={`/tickets/${eventId}/new`}>
					<Button variant="contained">Create new</Button>
				</Link>
			</Stack>
			<div style={{
				"height": '640px',
				"overflow": "auto"
			}}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 640 }} aria-label="Ticket table">
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Barcode</b>
							</TableCell>
							<TableCell>
								<b>Firstname</b>
							</TableCell>
							<TableCell>
								<b>Lastname</b>
							</TableCell>
							<TableCell align="right">
								<b>Options</b>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tickets.map(
							(row) => (
								<TableRow
									key={row.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{row.barcode}
									</TableCell>
									<TableCell>{row.firstName}</TableCell>
									<TableCell>{row.lastName}</TableCell>
									<TableCell align="right">
										<TableOptions
											itemType="tickets"
											eventId={row.eventId as string}
											ticketId={row.id as string}
											emitReloadEvent={fetchData}
										/>
									</TableCell>
								</TableRow>
							),
						)}
					</TableBody>
				</Table>
			</TableContainer>
			</div>
		</>
	);
}
