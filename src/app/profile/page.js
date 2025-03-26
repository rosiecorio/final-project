import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function ProfileRedirect() {
  const { userId } = await auth();
  
  if (userId) {
    redirect(`/profile/${userId}`);
  } else {
    redirect('/sign-in');
  }
}