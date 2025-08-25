// This is the code for your serverless function.
// It's written in a Node.js environment.

export default async function handler(req, res) {
  // Your secret API Key and Publication ID should be stored as environment variables,
  // not written directly in the code.
  const API_KEY = process.env.BEEHIIV_API_KEY;
  const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

  if (!API_KEY || !PUBLICATION_ID) {
    return res.status(500).json({ error: 'API key or Publication ID is not configured.' });
  }

  const BEEHIIV_API_URL = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/posts`;

  try {
    // Fetch the posts from the Beehiiv API
    const beehiivResponse = await fetch(BEEHIIV_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!beehiivResponse.ok) {
      // If Beehiiv returns an error, pass it along
      // This will give us a clear error like "Beehiiv API responded with status: 401"
      throw new Error(`Beehiiv API responded with status: ${beehiivResponse.status}`);
    }

    const data = await beehiivResponse.json();

    // Send the successfully fetched posts back to your frontend
    res.status(200).json(data.data);

  } catch (error) {
    // Handle any errors during the fetch
    console.error(error); // This still logs the full error for Vercel

    // --- THIS IS THE MODIFIED PART ---
    // We are now sending the specific error message back to the browser for debugging.
    res.status(500).json({ 
        error: 'Failed to fetch posts from Beehiiv.',
        details: error.message 
    });
  }
}
