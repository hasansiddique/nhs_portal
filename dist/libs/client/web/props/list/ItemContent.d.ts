import { CardProps } from '../../homepage/hompage-props';
import { default as React } from 'react';

interface PageData {
    page: number;
    totalPages: number;
    totalPage?: number;
}
interface ItemContentProps {
    propsList: CardProps[];
    showFilters?: boolean;
    nextPageData: PageData;
    fetchMoreProps: () => void;
    loadingMoreProps: boolean;
    loadingFilteredProps: boolean;
    isGridView: boolean;
}
declare const ItemContent: React.FC<ItemContentProps>;
export default ItemContent;
