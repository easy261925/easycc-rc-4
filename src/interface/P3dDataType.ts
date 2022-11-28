import { Key } from 'react';

export type P3dDataType = {
  id: Key;
  color: string;
  height: number;
  label?: string;
  offset: number;
  value: number;
};
