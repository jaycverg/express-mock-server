'use strict';

const log = require('fancy-log');
const color = require('ansi-colors');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const glob = require('glob');

glob('routes/*.json', {absolute: true}, (err, files) => {

    const portApis = files.reduce((groups, path) => {
        try {
            const json = JSON.parse(fs.readFileSync(path, 'utf8'));
            const group = groups[json.port] || [];
            group.push(json);
            groups[json.port] = group;
        } catch(e) {}
        return groups;
    }, {});


    const portEntries = Object.entries(portApis);
    for (const [port, routes] of portEntries) {
        const app = express();

        app.use(cors());

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
