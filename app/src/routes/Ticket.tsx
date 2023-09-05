import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { useGlobal } from '../context/global';

export default function Event() {
	const navigate = useNavigate();
	const { ticketId, eventId } = useParams();
	const defaultEvant = {
		id: '',
		title: '',
		city: '',
	};
	const [initialEvent, setInitialEvent] = useState(defaultEvant);

	const [ticket, setTicket] = useState({
		barcode: '10000000',
		firstName: '',
		lastName: '',
		eventId: eventId,
	});

	const [events, setEvents] = useState([]);

	const { cms } = useGlobal();

	const fetchEvents = async () => {
		try {
			const res = await cms.events.readByQuery({});
			const filteredInitialEvents = res.filter(el => el.id === eventId);
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
			const res = await cms.tickets.readOne(ticketId);
			setTicket(res);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchEvents();
		fetchData();
	}, []);

	const handleFieldChange = (e) => {
		const { id, value } = e.target;
		setTicket((prevTicket) => ({
			...prevTicket,
			[id]: value,
		}));
	};

	const submit = async () => {
		try {
			if (ticketId === 'new') {
				const res = await cms.tickets.createOne(ticket);
				if(res.eventId && res.id){
					navigate(`/tickets/${res.eventId}/${res.id}`);
				}else{
					window.alert(`Error on submission: ${res.message}`);
				}
			} else {
				const res = await cms.tickets.updateOne(ticketId, ticket);
				if(res.eventId && res.id){
					setTicket(res);
				}else{
					window.alert(`Error on submission: ${res.message}`);
				}
			}
		} catch (error) {
			console.error('Error submit data:', error);
			window.alert(`Error submit data: ${error.message}`);
		}
	};

	const filterEventOptions = createFilterOptions({
		matchFrom: 'start',
		stringify: (option) => option.title,
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
				<Link to="/events">
					<Button variant="contained">Back to Events</Button>
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
							getOptionLabel={(option) => option.title}
							options={events}
							filterOptions={filterEventOptions}
							sx={{ width: 300 }}
							renderInput={(params) => (
								<TextField {...params} label="Custom filter" />
							)}
							onChange={(e, newValue)=>{
								if(newValue!=null){
									setTicket((prevTicket) => ({
										...prevTicket,
										eventId: newValue.id
									}));
									setInitialEvent(newValue)
								}else{
									setTicket((prevTicket) => ({
										...prevTicket,
										eventId: null
									}));
									setInitialEvent(defaultEvant)
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
