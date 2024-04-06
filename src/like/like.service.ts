export interface LikeService<T> {
  createLike(targetId: number, userId: number): Promise<void>;
  deleteLike(targetId: number, userId: number): Promise<void>;
  getUserLikes(userId: number): Promise<T[]> | T[];
}
