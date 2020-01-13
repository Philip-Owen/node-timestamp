const http = require('http');


http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.url.includes('/api/timestamp')) {
        apiRouter(req.url, res)
    } else {
        const html = `
        <div>
            <h1>Node Timestamp</h1>
            <p><b>/api/timestamp</b>: Returns a current unix and utc timestamp</p>
            <p><b>/api/timestamp/:time-string</b>: Accepts either unix timestamp or date and returns unix timestamp and converted utc string or vice versa.</p>
            <p>Example:<b>/api/timestamp/2020-01-01</b> would return <code>{"unix":1577836800000,"utc":"Wed, 01 Jan 2020 00:00:00 GMT"}</code></p>
        </div>`
        res.write(html);
    }
    res.end();
}).listen(8080);


function apiRouter(url, res) {
    const routeParams = url.split('/api/timestamp')[1]
    switch(routeParams) {
        case '':
        case '/':
            returnTimestamp(res);
            break;
        default:
            convertTimestamp(res, routeParams);
            break;
    }
}


function returnTimestamp(res) {
    const date = new Date();
    const dataToSend = timestamp(date)
    res.write(JSON.stringify(dataToSend));
    res.end();
}


function convertTimestamp(res, param) {
    const convert = param.replace(/\//g, '');
    const error = {'error': 'Invalid Date'};

    if (convert.includes('-')) {
        return convertDateString(convert, res, error);
    }

    const date = new Date(parseInt(convert) * 1000);
    const isValid = date.toUTCString() !== "Invalid Date";
    
    if (isValid) {
        const dataToSend = timestamp(date)
        res.write(JSON.stringify(dataToSend))
        return;
    }

    res.write(JSON.stringify({...error}));
    return;
}


function convertDateString(convert, res, error) {
    const date = new Date(convert);

    const dateIsValid = date.toUTCString() !== "Invalid Date";

    if (dateIsValid) {
        const dataToSend = timestamp(date)
        res.write(JSON.stringify(dataToSend))
        return;
    }
    res.write(JSON.stringify({...error}));
    return;
}


function timestamp(date) {
    return {'unix': date.getTime(), 'utc': date.toUTCString()};
}
