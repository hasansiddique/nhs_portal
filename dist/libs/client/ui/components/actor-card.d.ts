export interface ActorProps {
    id: string;
    name: string;
    title: string;
    imgleft: string;
    wishlist: number;
    imgright1: string;
    imgright2: string;
    imgright3: string;
    totalLikes: number;
    totalImages?: number;
    totalProducts?: number;
    totalProductLikes?: number;
}
export declare const ActorCard: ({ item, redirectLink, }: {
    item: ActorProps;
    redirectLink: string;
}) => import("react/jsx-runtime").JSX.Element;
