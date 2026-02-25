const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "..", "lib", "ports.json");
const csvPath = path.join(__dirname, "..", "ports.csv");

function escapeCsv(val) {
  if (val === undefined || val === null) return "";
  let str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

try {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const ids = Object.keys(data);

  const headers = [
    "ID",
    "Name",
    "City",
    "Province",
    "Country",
    "Longitude",
    "Latitude",
    "Timezone",
    "Unlocs",
    "Code",
    "Alias",
    "Regions",
  ];

  const rows = [headers.join(",")];

  ids.forEach((id) => {
    const port = data[id];
    const row = [
      escapeCsv(id),
      escapeCsv(port.name),
      escapeCsv(port.city),
      escapeCsv(port.province),
      escapeCsv(port.country),
      escapeCsv(port.coordinates ? port.coordinates[0] : ""),
      escapeCsv(port.coordinates ? port.coordinates[1] : ""),
      escapeCsv(port.timezone),
      escapeCsv((port.unlocs || []).join(";")),
      escapeCsv(port.code),
      escapeCsv((port.alias || []).join(";")),
      escapeCsv((port.regions || []).join(";")),
    ];
    rows.push(row.join(","));
  });

  fs.writeFileSync(csvPath, rows.join("\n"), "utf8");
  console.log(`Successfully generated ${csvPath}`);
} catch (error) {
  console.error("Error converting JSON to CSV:", error);
  process.exit(1);
}
