export interface Orchid {
  orchidId: number;
  orchidName: string;
  natural: boolean;
  orchidDescription: string | null;
  orchidCategory: string | null;
  attractive: boolean;
  orchidURL: string | null;
}

export type OrchidDraft = Omit<
  Orchid,
  'orchidId' | 'orchidDescription' | 'orchidCategory' | 'orchidURL'
> & {
  orchidDescription: string;
  orchidCategory: string;
  orchidURL: string;
};
