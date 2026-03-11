declare const menus: ({
    id: number;
    name: string;
    links: string;
    namesub?: undefined;
} | {
    id: number;
    name: string;
    links: string;
    namesub: {
        id: number;
        sub: string;
        links: string;
    }[];
})[];
export default menus;
