const POST_URL = process.env.NEXT_PUBLIC_APP_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzeg4f-TkOLflmeJcb5HSw7i-5alrOuQvOVr1Rz2040BK4Aa4oce1kbfyn6TbhhF5AB/exec";

const matches = [
  { subcategory: "Round of 16", date: "2026-07-06T15:00", home: "Portugal", away: "Spain" },
  { subcategory: "Round of 16", date: "2026-07-06T20:00", home: "USA", away: "Belgium" },
  { subcategory: "Round of 16", date: "2026-07-07T12:00", home: "Argentina", away: "Egypt" },
  { subcategory: "Round of 16", date: "2026-07-07T16:00", home: "Switzerland", away: "Colombia" },
  { subcategory: "Quarter-finals", date: "2026-07-09T16:00", home: "France", away: "Morocco" },
  { subcategory: "Quarter-finals", date: "2026-07-10T15:00", home: "TBD", away: "TBD" },
  { subcategory: "Quarter-finals", date: "2026-07-11T17:00", home: "Norway", away: "England" },
  { subcategory: "Quarter-finals", date: "2026-07-11T21:00", home: "TBD", away: "TBD" },
  { subcategory: "Semi-finals", date: "2026-07-14T15:00", home: "TBD", away: "TBD" },
  { subcategory: "Semi-finals", date: "2026-07-15T15:00", home: "TBD", away: "TBD" },
  { subcategory: "Third place play-off", date: "2026-07-18T17:00", home: "TBD", away: "TBD" },
  { subcategory: "Final", date: "2026-07-19T15:00", home: "TBD", away: "TBD" },
];

async function run() {
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const eventName = `${m.home} vs ${m.away}`;
    const payload = new URLSearchParams();
    payload.append("action", "addTicket");
    payload.append("admin", "house");
    payload.append("ticketId", `seed-ko-${i + 1}`);
    payload.append("eventName", eventName);
    payload.append("category", "Football");
    payload.append("tournament", "FIFA World Cup 2026");
    payload.append("subcategory", m.subcategory);
    payload.append("venue", "TBD");
    payload.append("location", "TBD");
    payload.append("dateTime", m.date);
    payload.append("coverImage", "");
    payload.append("ticketStatus", "ACTIVE");
    payload.append("platform", "escrow");
    payload.append("section", "");
    payload.append("row", "");
    payload.append("seatNumbers", "");
    payload.append("paymentSettings", "");
    payload.append("currency", "USD");
    payload.append("description", "");

    const res = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    });
    const text = await res.text();
    console.log(`[${i + 1}/${matches.length}] ${eventName} → ${res.status} ${text}`);
  }
}
run().catch(console.error);
