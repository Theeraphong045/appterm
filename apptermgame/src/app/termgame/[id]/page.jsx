// import Termgame_item from "../components/termgame_item";

import Termgame_Desc from "@/app/components/termgame/desc"
import { Image } from "@nextui-org/react"

async function getData(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/termgame/${id}`, { cache: 'no-store' })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
export default async function Termgame_One({ params }) {
    const data = await getData(params.id)
    return (
        <Termgame_Desc data={data} />
    );
}
