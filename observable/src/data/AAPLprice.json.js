import fs from "fs";
import path from "path";

//read file from public/graph
const projectRoot = process.cwd();
const AAPLprice = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "../public/graphs/AAPLprice.json"), "utf-8"),
);
//export the data
process.stdout.write(JSON.stringify(AAPLprice));