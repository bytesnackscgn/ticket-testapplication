import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGlobal } from '../context/global';
import { EventsController } from '../lib/controller/events';
import { TicketsController } from '../lib/controller/tickets';

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color:
			theme.palette.mode === 'light'
				? 'rgb(55, 65, 81)'
				: theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
			},
		},
	},
}));

const TableOptions: React.FC<{
	itemType: string;
	eventId?: string;
	ticketId?: string;
	emitReloadEvent: Function;
}> = ({ itemType, eventId, ticketId, emitReloadEvent }) => {
	const { cms } = useGlobal() as any as {
		cms: { events: EventsController; tickets: TicketsController };
	};

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteItem = async () => {
		try {
			const controller = cms[itemType as keyof typeof cms] as EventsController | TicketsController;

			let deleteId: string = eventId as string;

			if (itemType === 'events') {
				deleteId = eventId as string;
			} else if (itemType === 'tickets') {
				deleteId = ticketId as string;
			}

			const res = (await controller.deleteOne(deleteId as string)) as string[];
			if (res && res.length === 1) {
				emitReloadEvent();
			}
		} catch (error) {
			console.error('Error deleting item:', error);
		}
		handleClose();
	};

	const editPath =
		itemType === 'events'
			? `/events/${eventId}`
			: itemType === 'tickets'
			? `/tickets/${eventId}/${ticketId}`
			: '';

	const ticketPath = itemType === 'events' ? `/tickets/${eventId}` : '';

	return (
		<div>
			<Button
				id="table-options-menu-button"
				aria-controls={open ? 'table-options-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				disableElevation
				onClick={handleClick}
			>
				<MoreVertIcon />
			</Button>
			<StyledMenu
				id="table-options-menu"
				MenuListProps={{
					'aria-labelledby': 'table-options-menu-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose} disableRipple>
					<Link to={editPath} style={{ textDecoration: 'none' }}>
						<EditIcon />
						Edit
					</Link>
				</MenuItem>
				{ticketPath && (
					<MenuItem disableRipple>
						<Link to={ticketPath} style={{ textDecoration: 'none' }}>
							<ConfirmationNumberIcon />
							Tickets
						</Link>
					</MenuItem>
				)}
				<MenuItem onClick={deleteItem} disableRipple>
					<DeleteIcon />
					Delete
				</MenuItem>
			</StyledMenu>
		</div>
	);
};

export default TableOptions;
