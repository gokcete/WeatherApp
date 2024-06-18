import fs from "node:fs";
import { parse } from "csv-parse";

export function createCSVParser(parseOptions = {}) {
  return async (filepath) => {
    return new Promise((resolve, reject) => {
      const records = [];
      let props;

      fs.createReadStream(filepath)
        .on("error", reject)
        .pipe(parse(parseOptions))
        .on("data", (row) =>
          props ? records.push(transformRecords(row)) : (props = row)
        )
        .on("end", () => resolve(records));

      function transformRecords(row) {
        return Object.fromEntries(
          row.map((value, index) => [props[index], value])
        );
      }
    });
  };
}
