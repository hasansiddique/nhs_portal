import { Dispatch, SetStateAction } from 'react';

export declare const CommentsPage: () => import("react/jsx-runtime").JSX.Element;
export declare const DeletePopup: ({ showModal, setShowModal, handleDelete, title, btnTitle, isSpacing, }: {
    showModal: boolean;
    handleDelete: () => void;
    setShowModal: Dispatch<SetStateAction<string>>;
    title?: string;
    btnTitle?: string;
    isSpacing: boolean;
}) => import("react/jsx-runtime").JSX.Element;
