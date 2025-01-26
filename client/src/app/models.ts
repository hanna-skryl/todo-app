export type Item = {
  description: string;
  done: boolean;
};

export const FILTERS = ['All', 'Active', 'Completed'] as const;
export type FilterOption = (typeof FILTERS)[number];

export const MODE = ['light', 'dark'] as const;
export type Mode = (typeof MODE)[number];

export type Preset = {
  _id?: string;
  title: string;
  items: string[];
};

export type CreatePresetResponse = {
  insertedId: string;
};
