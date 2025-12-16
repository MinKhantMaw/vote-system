export enum VoterType {
  GROUP = 'GROUP',
  GUESS = 'GUESS'
}

export interface Voter {
  id: string;
  name: string;
  type: VoterType;
}

export interface Vote {
  voterId: string;
  votedForId: string;
}

export const VOTERS: Voter[] = [
  { id: 'Group A', name: 'Group A', type: VoterType.GROUP },
  { id: 'Group B', name: 'Group B', type: VoterType.GROUP },
  { id: 'Group C', name: 'Group C', type: VoterType.GROUP },
  { id: 'Group D', name: 'Group D', type: VoterType.GROUP },
  { id: 'Group E', name: 'Group E', type: VoterType.GROUP },
  { id: 'Guess 1', name: 'Guess 1', type: VoterType.GUESS },
  { id: 'Guess 2', name: 'Guess 2', type: VoterType.GUESS },
];

export const CANDIDATES = [
  'Group A',
  'Group B',
  'Group C',
  'Group D',
  'Group E'
];

export const GROUP_IMAGES: Record<string, string> = {
  'Group A': '/images/1.jfif',
  'Group B': '/images/2.jfif',
  'Group C': '/images/3.jfif',
  'Group D': '/images/4.jfif',
  'Group E': '/images/5.jfif',
};