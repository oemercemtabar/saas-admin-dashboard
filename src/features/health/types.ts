export type ServiceStatus = "healthy" | "degraded" | "down";

export type Service = {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  uptime: number;
};

export type HealthResponse = {
  updatedAt: string;
  services: Service[];
};