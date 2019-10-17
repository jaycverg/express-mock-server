'use strict';

const log = require('fancy-log');
const color = require('ansi-colors');
const express = require('express');
const fs = require('fs');
const glob = require('glob');

glob('routes/*.json', {absolute: true}, (err, files) => {

	const portApis = {};

	files.forEach(path => {
		try {
			const json = JSON.parse(fs.readFileSync(path, 'utf8'));
			const portGroup = portApis[json.port] || [];
			portGroup.push(json);
			portApis[json.port] = portGroup;
		} catch(e) {}
	});

	const portEntries = Object.entries(portApis);
	for (const [port, routes] of portEntries) {
		const app = express();

		log.info(color.grey(`configuring app at ${port}`));
		routes.forEach(route => {
			log.info(color.grey(`- ${route.path}`));

			// Accepts both GET and POST requests
			app.all(route.path, (req, res) => {
				res.set('Content-Type', 'application/json');

				const queries = route.queries || [];
				queries: for (const {params, response} of queries) {
					for (const key in params) {
						if (params[key] !== req.query[key]) {
							continue queries;
						}
					}

					return res.send(JSON.stringify(response));
				}

				return res.send(JSON.stringify(route.response));
			});
		});

		log.info(`Starting server at ${port}\n`);
		app.listen(port);
	}
});