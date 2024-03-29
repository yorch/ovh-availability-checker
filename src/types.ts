import type { Logger } from './logger.js';

export type Action = ({
  content,
  logger,
}: {
  content: string;
  logger: Logger;
}) => Promise<void> | void;

export type Region = 'apac' | 'europe' | 'northAmerica';

export enum Datacenter {
  // North America
  BHS = 'bhs',
  HIL = 'hil',
  VIN = 'vin',
  // Europe
  FRA = 'fra',
  GRA = 'gra',
  LON = 'lon',
  RBX = 'rbx',
  SBG = 'sbg',
  WAW = 'waw',
  // APAC
  SGP = 'sgp',
  SYD = 'syd',
}

export type DatacenterAvailability = {
  availability: string;
  datacenter: Datacenter;
};

export type HardwareAvailability = {
  region: Region;
  hardware: string;
  datacenters: DatacenterAvailability[];
};

export type Server = {
  id: string;
  model: string;
  provider: string;
  cpu: string;
  cpuCores: string;
  cpuFreq: string;
  ram: string;
  disk: string;
  network: string;
  priceMonthly: number;
  installationFee: number;
};

export type ServerToCheck = {
  enable: boolean;
  name: string;
  price: string;
  ram: string;
  cpu: string;
  disk: string;
  network: string;
  // Datacenters: Datacenter[];
  datacenters: string[];
};

export type ServersToCheck = Record<string, ServerToCheck>;

export type ServerAvailable = Pick<
  ServerToCheck,
  'name' | 'cpu' | 'ram' | 'disk' | 'price'
> & {
  availability: Array<Pick<HardwareAvailability, 'datacenters' | 'region'>>;
  availableIn: Datacenter[];
  code: string;
  datacentersAvailability: DatacenterAvailability[];
};

export type ServersAvailable = ServerAvailable[];
