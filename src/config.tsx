const isDevolpment = import.meta.env.DEV;

export const API_BASE_URL = isDevolpment
  ? "http://localhost:8000"
  : "https://discogs.lyngner.com";
