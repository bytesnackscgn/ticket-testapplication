import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import type { Events, Tickets } from '../../types'
import { useGlobal } from '../context/global';
import { ChangeEvent } from 'react';
import { EventsController } from '../lib/controller/events';
import { TicketsController } from '../lib/controller/tickets';

export default function Event() {
	const navigate = useNavigate();
	const { ticketId, eventId } = useParams();
	const defaultEvent = {
		id: '',
		title: '',
		city: '',
		date: ''
	};

	const [initialEvent, setInitialEvent] = useState(defaultEvent as Events);

	const [ticket, setTicket] = useState({
		barcode: '10000000',
		firstName: '',
		lastName: '',
		eventId: eventId,
	} as Tickets);

	const [events, setEvents] = useState([] as Events[]);

	const { cms } = useGlobal() as unknown as { cms: { events: EventsController, tickets: TicketsController }};

	const fetchEvents = async () => {
		try {
			const res = await cms.events.readByQuery({}) as Events[];
			const filteredInitialEvents: Events[] = res.filter(el => el.id === eventId);
			if(filteredInitialEvents.length === 1){
				setInitialEvent(filteredInitialEvents[0]);
			}
			setEvents(res);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const fetchData = async () => {
		if (ticketId === 'new') return;

		try {
			const res = await cms.tickets.readOne(ticketId as string);
			setTicket(res as Tickets);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchEvents();
		fetchData();
	}, []);

	const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setTicket((prevTicket) => ({
			...prevTicket,
			[id]: value,
		}));
	};

	const submit = async () => {
		try {
			if (ticketId === 'new') {
				const res: Tickets = (await cms.tickets.createOne(ticket)) as Tickets;
				if(res.eventId && res.id){
					navigate(`/tickets/${res.eventId}/${res.id}`);
				}else{
					window.alert(`Error on submission: ${res}`);
				}
			} else {
				const res = await cms.tickets.updateOne(ticketId as string, ticket) as Tickets;
				if(res.eventId && res.id){
					setTicket(res);
				}else{
					window.alert(`Error on submission: ${res}`);
				}
			}
		} catch (error: unknown) {
			console.error('Error submit data:', error);
			window.alert(`Error submit data: ${error}`);
		}
	};

	const filterEventOptions = createFilterOptions({
		matchFrom: 'start',
		stringify: (option: Events) => option.title as string,
	});

	return (
		<>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				spacing={2}
				mb={4}
			>
				<Link to={`/tickets/${eventId}`}>
					<Button variant="contained">Back to Tickets</Button>
				</Link>
				<Button variant="contained" onClick={submit}>
					Submit
				</Button>
			</Stack>
			<form>
				<div>
					<Stack
						className="w-100"
						direction="column"
						justifyContent="center"
						alignItems="center"
						spacing={2}
						mb={3}
					>
						<Autocomplete
							freeSolo
							id="eventId"
							value={ initialEvent }
							inputValue={ initialEvent.title }
							getOptionLabel={(option) => {
								const option_ = option as Events
								return option_.title as string
							}}
							options={events}
							filterOptions={filterEventOptions}
							sx={{ width: 300 }}
							renderInput={(params) => (
								<TextField {...params} label="Custom filter" />
							)}
							onChange={(_e, newValue)=>{
								if(newValue!=null){
									const newVal = newValue as Events;
									setTicket((prevTicket) => ({
										...prevTicket,
										eventId: newVal.id
									}));
									setInitialEvent(newVal)
								}else{
									setTicket((prevTicket) => ({
										...prevTicket,
										eventId: ''
									}));
									setInitialEvent(defaultEvent)
								}
							}}
						/>

						<TextField
							id="barcode"
							className="w-100"
							label="Barcode"
							variant="standard"
							value={ticket.barcode}
							onChange={handleFieldChange}
						/>

						<TextField
							id="firstName"
							className="w-100"
							label="firstName"
							variant="standard"
							value={ticket.firstName}
							onChange={handleFieldChange}
						/>

						<TextField
							id="lastName"
							className="w-100"
							label="Lastname"
							variant="standard"
							value={ticket.lastName}
							onChange={handleFieldChange}
						/>
					</Stack>
				</div>
			</form>
		</>
	);
}
