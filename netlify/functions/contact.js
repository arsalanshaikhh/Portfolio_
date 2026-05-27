exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid request body' }) };
    }

    const { name, email, message } = payload;

    if (!name || !email || !message) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing required fields' }) };
    }

    let response, data;
    try {
        response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY,
                subject: `New portfolio message from ${name}`,
                from_name: 'Portfolio Contact',
                name,
                email,
                message
            })
        });
        data = await response.json();
    } catch (err) {
        return {
            statusCode: 502,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Failed to reach email service' })
        };
    }

    return {
        statusCode: response.ok ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
};
