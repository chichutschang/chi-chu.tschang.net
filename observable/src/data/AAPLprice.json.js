import fs from "fs";
import path from "path";

//read file from public/graph
const filePath = path.join(process.cwd(), "observable", "src", "data", "AAPLprice.json");
const AAPLprice = JSON.parse(
    fs.readFileSync(path.join(projectRoot, "../public/graphs/AAPLprice.json"), "utf-8"),
);
//export the data
process.stdout.write(JSON.stringify(AAPLprice));