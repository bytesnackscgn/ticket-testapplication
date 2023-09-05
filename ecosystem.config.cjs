module.exports = {
	apps: [
		{
			name: 'ticket-testapplication',
			port: 3069,
			exec_mode: 'fork',
			script: './api/dist/src/main.js',
			env: {
				CONFIG_PATH: '/home/ticket-testapplication/.env.production',
				NODE_ENV: 'production',
			},
			autorestart: true,
			watch: false,
			max_old_space_size: '2048M',
			max_memory_restart: '1800M',
			out_file: './pm2-log/out.log',
			error_file: './pm2-log/error.log',
			log_file: './pm2-log/log.log',
			log_type: 'json',
			log_date_format: 'DD-MM-YYYY hh:mm',
		},
	],
};
