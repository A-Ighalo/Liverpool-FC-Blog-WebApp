export interface BlogPost {
  id?: number;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  isPublished: boolean;
  author?: {
    id: number;
    username: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface BlogPostPage {
  content: BlogPost[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}