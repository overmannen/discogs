const isDevolpment = import.meta.env.DEV;

export const API_BASE_URL = isDevolpment
  ? "http://localhost:8000"
  : "https://abacage-api-6903792357.europe-west1.run.app/";
