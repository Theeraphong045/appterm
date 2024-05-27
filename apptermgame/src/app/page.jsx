import Slid from "./components/slid";
import Termgame_item from "./components/termgame/item";
import APP_item from "./components/app/item";

async function getTermgame() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/termgame/list`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
async function getAPP() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/app/list`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
async function getAnnounce() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/announce`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Home() {
  const Game = await getTermgame()
  const App = await getAPP()
  const Announce = await getAnnounce()
  return (
    <div className="flex flex-col gap-5">
      <Slid data={Announce} />
      <div className="flex gap-5 h-12 justify-center items-center">
        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">เติมเกม</p>
      </div>
      <div className="flex gap-2 justify-center">
        {Game.slice(0, 6).map((d, i) => (
          <Termgame_item data={d} key={i} />
        ))}
      </div>
      <div className="flex gap-5 h-12 justify-center items-center mt-5">
        <p className="text-2xl px-5 py-1 border-s-3 border-e-3 border-primary bg-gradient-to-t from-primary rounded-md">แอปพรีเมี่ยม</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2">
        {App.slice(0, 4).map((d, i) => (
          <APP_item data={d} key={i} />
        ))}
      </div>
    </div>
  );
}
