import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
    <div className='w-[screen] h-[85vh] flex flex-col items-center'>
      <SignIn />
    </div>
  ) 
}