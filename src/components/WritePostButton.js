'use client'

import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";


export default function WritePostButton() {
    const WritePostButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/new-post');
    };

    return (
        <Button onClick={handleClick}>
            Write a Post
        </Button>
    );
};
}