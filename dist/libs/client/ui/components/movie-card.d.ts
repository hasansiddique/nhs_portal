export interface MovieProps {
    id: string;
    name: string;
    title: string;
    imgleft: string;
    wishlist: number;
    imgAuthor: string;
    imgright1: string;
    imgright2: string;
    imgright3: string;
    totalLikes: number;
    totalImages: number;
}
export declare const MovieGridCard: ({ item, redirectLink, }: {
    item: MovieProps;
    redirectLink: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const MovieListCard: ({ item, redirectLink, }: {
    item: MovieProps;
    redirectLink: string;
}) => import("react/jsx-runtime").JSX.Element;
