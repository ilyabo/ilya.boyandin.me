export enum LocalityType {
  COUNTRY = 'Country',
  // TODO:
}

export type Locality = {
  id: number;
  created_at: string;
  name: string;
  type: LocalityType;
  shape?: string;
};

export enum CompanySiteType {
  USINE = 'Usine',
  MINE = 'Mine',
  ENTITE_DE_TRAITMENT = 'Entite de traitment',
}

export type CompanySite = {
  id: number;
  created_at: string;
  name: string;
  locality_id: number;
  province_id: number;
  description: string;
  lat: number;
  lon: number;
  is_main_site: boolean;
  source_id: number;
  type: CompanySiteType;
};
