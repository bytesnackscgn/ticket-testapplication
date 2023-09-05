import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs'
import { useGlobal } from '../context/global';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Events } from '../../types'
import { EventsController } from '../lib/controller/events';
import { TicketsController } from '../lib/controller/tickets';

export default function Event() {
	const navigate = useNavigate();
	const { eventId } = useParams();

	const [event, setEvent] = useState({
		title: '',
		city: '',
		date: new Date().toISOString()
	} as Events);

	const { cms } = useGlobal() as unknown as { cms: { events: EventsController, tickets: TicketsController }};

	const fetchData = async () => {
		if (eventId === 'new') return;

		try {
			const res = await cms.events.readOne(eventId as string);
			setEvent(res as Events);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setEvent((prevEvent) => ({
			...prevEvent,
			[id]: value,
		}));
	};

	const handleDateChange = (e: Dayjs | null) => {
		if(e === null) return;
		
		if (typeof e === 'object') {
			setEvent((prevEvent) => ({
				...prevEvent,
				date: e.toISOString(),
			}));
		}
	}

	const submit = async () => {
		try{
			if (eventId === 'new') {
				const res = await cms.events.createOne(event) as Events;
				navigate(`/events/${res.id}`);
			}else{
				const res = await cms.events.updateOne(eventId as string, event);
				setEvent(res as Events);
			}
		}catch(error){
			console.error('Error submit data:', error);
		}
	};

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
				<Button variant="contained" onClick={submit}>Submit</Button>
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
						<TextField
							id="title"
							className="w-100"
							label="Title"
							variant="standard"
							value={event.title}
							onChange={handleFieldChange}
						/>

						<TextField
							id="city"
							className="w-100"
							label="City"
							variant="standard"
							value={event.city}
							onChange={handleFieldChange}
						/>

						<DatePicker
							className="w-100"
							value={dayjs(event.date)}
							onChange={(e) => handleDateChange(e)}
						/>
					</Stack>
				</div>
			</form>
		</>
	);
}
