export type HealthStatus = 'operational' | 'degraded' | 'down';

export interface HealthItem {
  name: string;
  status: HealthStatus;
}

export const systemHealth: HealthItem[] = [
  { name: 'API Services', status: 'operational' },
  { name: 'Vector Database', status: 'operational' },
  { name: 'AI Models', status: 'operational' },
  { name: 'Agent Network', status: 'operational' },
  { name: 'Memory Store', status: 'operational' },
];
