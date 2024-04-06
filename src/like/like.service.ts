export interface LikeService<T> {
  like(targetId: number, userId: number): Promise<void>;
  deleteLike(targetId: number, userId: number): Promise<void>;
  getUserLikes(userId: number): Promise<T[]> | T[];
}
