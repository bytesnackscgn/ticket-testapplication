import { useState, useEffect } from 'react';
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

import { isoToEuropeanDateTime } from '../lib/time';
import { useGlobal } from '../context/global';
import TableOptions from '../components/TableOptions';
import type { Events } from '../../types'
import { EventsController } from '../lib/controller/events';
import { TicketsController } from '../lib/controller/tickets';

export default function Events() {
	const [events, setEvents] = useState([] as Events[]);
	const { cms } = useGlobal() as { cms: { events: EventsController, tickets: TicketsController }};

	const fetchData = async () => {
		try {
			const res = await cms.events.readByQuery({ sort: 'date' });
			setEvents(res as Events[]);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	useEffect(() => {
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
				<h3>All Events</h3>
				<Link to="/events/new">
					<Button variant="contained">Create new</Button>
				</Link>
			</Stack>
			<div style={{
				"height": '640px',
				"overflow": "auto"
			}}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 640 }} aria-label="Event table">
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Date Time</b>
							</TableCell>
							<TableCell>
								<b>Title</b>
							</TableCell>
							<TableCell>
								<b>City</b>
							</TableCell>
							<TableCell align="right">
								<b>Options</b>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{events.map(
							(
								row, // Use map instead of forEach
							) => (
								<TableRow
									key={row.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{isoToEuropeanDateTime(row.date)}
									</TableCell>
									<TableCell>{row.title}</TableCell>
									<TableCell>{row.city}</TableCell>
									<TableCell align="right">
										<TableOptions
											itemType="events"
											eventId={row.id as string}
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
