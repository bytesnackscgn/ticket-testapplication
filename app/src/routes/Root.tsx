import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Root() {
	const [greeting, setGreeting] = useState('');
	useEffect(() => {
		fetch('/api')
			.then((res) => res.text())
			.then(setGreeting);
	}, []);
	return (
		<>
			<Stack
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={2}
				mb={4}
			>
				<div>
					<a href="https://vitejs.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1>Vite + React</h1>
				<h1>{greeting}</h1>
				<Link to="/events">
					<Button variant="contained">Go to Events</Button>
				</Link>
			</Stack>
		</>
	);
}
