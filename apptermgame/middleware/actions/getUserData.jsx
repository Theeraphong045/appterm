'use server';

export async function getUserData(token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/userdata`, {
    cache: 'no-store',
    headers: {
      Authorization: token,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }
  return res.json();
}