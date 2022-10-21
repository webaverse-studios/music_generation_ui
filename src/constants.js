export const API_URL = "/api/generate"; //"http://127.0.0.1:7777/generate";
export const API_URL_RESULT = "/api/generate_result"; //"http://127.0.0.1:7777/generate_result";
export const SERVER_URL = "http://216.153.50.75:7777";
export const DURATIONS = ["24s", "1m 59s", "3m 58s"];

export const getIndexFromDuration = (duration) => {
  const index = DURATIONS.indexOf(duration);
  if (index < 0 || index > DURATIONS.length - 1) {
    return 0;
  }
  return index;
};
