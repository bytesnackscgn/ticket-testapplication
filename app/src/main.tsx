import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';

import { routes } from './router/';
import { GlobalProvider } from './context/global';

import './index.css';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
	<Stack
	className='vhw-100'
		direction="column"
		justifyContent="center"
		alignItems="center"
	>
		<React.StrictMode>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<GlobalProvider>
					<div>
					<RouterProvider router={router} />
					</div>
				</GlobalProvider>
			</LocalizationProvider>
		</React.StrictMode>
	</Stack>,
);
