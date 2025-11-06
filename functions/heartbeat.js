const fetch = require("node-fetch");

export async function handler() {
  const heartbeatIds = {
    "Midtown": "435397",
    "Chicopee": "435398",
    "Midtown-to-Queens": "435399",
    "Bramm-All-Day": "HEARTBEAT_ID_4",
    "Bramm AM Peak": "435400",
    "Bramm PM Peak": "435395"
  };

  const apiToken = process.env.BETTERUPTIME_TOKEN;
  const results = [];

  for (const [name, id] of Object.entries(heartbeatIds)) {
    try {
      const res = await fetch(`https://api.betteruptime.com/v2/heartbeats/${id}`, {
        headers: { Authorization: `Bearer ${apiToken}` }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      results.push({ name, status: data.last_status });
    } catch (err) {
      console.error(`Error fetching ${name}:`, err.message);
      results.push({ name, status: "unknown" });
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(results)
  };
};
