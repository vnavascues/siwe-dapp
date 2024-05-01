export type JSONValue = string | null | number | boolean | JSONObject | Array<JSONValue>;

export interface JSONObject {
  [key: string]: JSONValue;
}
