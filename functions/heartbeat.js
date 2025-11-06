const fetch = require("node-fetch"); // CommonJS style for Netlify

exports.handler = async function(event, context) {
/* const heartbeatIds = {
    "Midtown": "435397",
    "Chicopee": "435398",
    "Midtown-to-Queens": "435399",
    "Bramm-All-Day": "LRVaemwMfEXJ5qSXxJ2TK2Cd",
    "Bramm AM Peak": "435400",
    "Bramm PM Peak": "435395"   */
  const heartbeatIds = {
  "Midtown": "435397",
  "Chicopee": "LRVaemwMfEXJ5qSXxJ2TK2Cd",
  "Midtown-to-Queens": "LRVaemwMfEXJ5qSXxJ2TK2Cd",
  "Bramm-All-Day": "LRVaemwMfEXJ5qSXxJ2TK2Cd",
  "Bramm AM Peak": "LRVaemwMfEXJ5qSXxJ2TK2Cd",
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
    const res = await fetch(`https://api.betteruptime.com/v2/heartbeats/${id}`, {
      headers: { Authorization: `Bearer ${apiToken}` }
    });

    console.log(`${name} status code: ${res.status}`);

    const data = await res.json();
    console.log(`${name} response:`, data);

    if (data && data.last_status) {
      results.push({ name, status: data.last_status });
    } else {
      results.push({ name, status: "unknown" });
    }
  } catch (err) {
    console.error(`Error fetching ${name}:`, err.message);
    results.push({ name, status: "unknown" });
  }
}


  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(results)
  };
};


console.log(`Fetching heartbeat ${name}: https://api.betteruptime.com/v2/heartbeats/${id}`);



