import APP_item from "../components/app/item"
async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/app/list`, { cache: 'no-store' })

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
export default async function Termgame_list() {
    const data = await getData()
    return (
        <div className="flex flex-col gap-5">
            <div className="flex gap-5 h-12 items-center">
                <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">แอปพรีเมี่ยม</p>
            </div>
            <div className="grid md:grid-cols-5 xl:grid-cols-6 gap-2">
                {data.map((d, i) => (
                    <APP_item data={d} key={i} />
                ))}
            </div>
        </div>
    );
}
