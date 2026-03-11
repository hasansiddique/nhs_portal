export interface ActiveFilterProps {
    filterType: string;
    value: string;
    name?: string;
    id?: string;
}
interface FilterSubCategoryProps {
    categoryName: string;
    name: string;
    id: string;
}
export interface FilterSortingProps {
    label: string;
    id: string;
}
export interface FilterProps {
    productCategories: FilterSubCategoryProps[];
    productSaleTypes: FilterSubCategoryProps[];
    productTypes: FilterSubCategoryProps[];
    collections: FilterSortingProps[];
    sorting: FilterSortingProps[];
}
export declare const PropListing: () => import("react/jsx-runtime").JSX.Element;
export {};
