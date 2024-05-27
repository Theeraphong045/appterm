'use server';

export async function getSettingData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/setting`);
    if (!res.ok) {
        throw new Error('Failed to fetch setting data');
    }
    return res.json();
}