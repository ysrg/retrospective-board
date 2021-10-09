export interface TaskboardItem {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  likes: number;
  likedBy: string[];
}
export interface KeyMatch {
  key: string;
}

export interface LikedBy {
  uid: string;
  pos: number;
}
export interface NoteItem {
  createdBy: string;
  description: string;
  likes: number;
  parent: string;
  title: string;
  likedBy: LikedBy;
}

export enum TaskboardItemStatus {
  WENT_WELL = 'What Went Well',
  NEEDS_IMPROVEMENT = 'Needs To Be Improved',
  ACTION_ITEMS = 'Action Items',
  APPRECIATIONS = 'Appreciations',
}
