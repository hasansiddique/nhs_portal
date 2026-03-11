export interface CardProps {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: string;
  movieName: string;
  imagePath: string;
  subTitle?: string;
  isOriginal: string;
  productLikes: string;
  listingType: string;
  showcaseOnly: boolean;
}

interface ProductImageProps {
  image: string;
}

export interface FeatureCardProps {
  productImages: ProductImageProps[];
  totalProductsLikes: number;
  totalProductLikes: number;
  totalProducts: number;
  totalLikes: number;
  username: string;
  images: string[];
  title: string;
  name: string;
  id: string;
}
