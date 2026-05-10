exports.handler = async function () {
    try {
        const response = await fetch('https://medium.com/feed/@arsalan-shaikh', {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-bot/1.0)' }
        });

        if (!response.ok) {
            return { statusCode: response.status, body: 'Medium feed unavailable' };
        }

        const xml = await response.text();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            body: xml
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch Medium feed' })
        };
    }
};
