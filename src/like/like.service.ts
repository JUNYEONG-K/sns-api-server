export interface LikeService<T> {
  like(targetId: number, userId: number): Promise<void>;
  deleteLike(targetId: number, userId: number): Promise<void>;
}
