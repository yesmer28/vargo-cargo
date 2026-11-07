import { API_BASE_URL } from "@/lib/api-config";
import { TrackingInfo } from "@/types/tracking";

export async function fetchTracking(
  trackingNumber: string,
  token: string,
): Promise<TrackingInfo> {
  const response = await fetch(
    `${API_BASE_URL}/tracking/${encodeURIComponent(trackingNumber)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("SERVER_ERROR");
  }

  return response.json() as Promise<TrackingInfo>;
}

export function getTrackingErrorMessage(
  trackingNumber: string,
  error: unknown,
): string {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Su sesión expiró. Inicie sesión nuevamente para rastrear paquetes.";
  }

  if (error instanceof Error && error.message === "NOT_FOUND") {
    return `No encontramos el código de rastreo: "${trackingNumber}". Revise el código e intente nuevamente.`;
  }

  return "No pudimos consultar el rastreo en este momento. Intente nuevamente en unos minutos.";
}
