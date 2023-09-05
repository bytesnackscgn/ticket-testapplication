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

export default function Tickets() {
	const { eventId } = useParams();
	const { cms } = useGlobal();

	const [tickets, setTickets] = useState([]);
	const [event, setEvent] = useState({});

	const fetchEvent = async () => {
		try {
			const res = await cms.events.readOne(eventId);
			setEvent(res);
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

			setTickets(res);
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
				<Link to={`/tickets/${eventId}/new`}>
					<Button variant="contained">Create new</Button>
				</Link>
			</Stack>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
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
							(
								row, // Use map instead of forEach
							) => (
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
											eventId={row.eventId}
											ticketId={row.id}
											emitReloadEvent={fetchData}
										/>
									</TableCell>
								</TableRow>
							),
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
