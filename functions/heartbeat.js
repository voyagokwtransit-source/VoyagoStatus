// heartbeat.js
// Works on Netlify with Node 22+ using native fetch

exports.handler = async function(event, context) {
  const heartbeatIds = {
    "Midtown": "435395",
    "Chicopee": "435395",
    "Midtown-to-Queens": "435395",
    "Bramm-All-Day": "435395",
    "Bramm AM Peak": "435395",
    "Bramm PM Peak": "LRVaemwMfEXJ5qSXxJ2TK2Cd"
  };

  const apiToken = process.env.BETTERUPTIME_TOKEN;
  if (!apiToken) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "BETTERUPTIME_TOKEN not set" })
    };
  }

  const results = [];

  for (const [name, id] of Object.entries(heartbeatIds)) {
    try {
      console.log(`Fetching ${name}: https://api.betteruptime.com/v2/heartbeats/${id}`);
      const res = await fetch(`https://api.betteruptime.com/v2/heartbeats/${id}`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });

      if (!res.ok) {
        console.error(`${name} returned status ${res.status}`);
        results.push({ name, status: "unknown" });
        continue;
      }

      const data = await res.json();
      // last_status can be "up", "down", etc.
      results.push({ name, status: data.last_status || "unknown" });

    } catch (err) {
      console.error(`Error fetching ${name}:`, err.message);
      results.push({ name, status: "unknown" });
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"  // CORS header for browser access
    },
    body: JSON.stringify(results)
  };
};
