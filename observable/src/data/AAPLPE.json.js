import fs from "fs";
import path from "path";

//read file from public/graph
const projectRoot = process.cwd();
const AAPLPE = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "../public/graphs/AAPLPE.json"), "utf-8"),
);
//export the data
process.stdout.write(JSON.stringify(AAPLPE));