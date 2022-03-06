import type { Logger } from './logger';

export type Action = ({
  content,
  logger,
}: {
  content: string;
  logger: Logger;
}) => Promise<void> | void;

export type Availability = 'unavailable' | 'unknown';

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
  availability: Availability | string;
  datacenter: Datacenter;
};

export type HardwareAvailability = {
  region: Region;
  hardware: string;
  datacenters: DatacenterAvailability[];
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
