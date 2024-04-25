import { auth } from '@/auth'
import SignupForm from '@/components/signup-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function SignupPage() {
  const session = (await auth()) as Session

  if (session) {
    redirect('/')
  }

  return (
    <main className="flex flex-col p-4">
      {/* <SignupForm /> */}
    <div className="text-center mt-4">
      <p className="text-xl text-gray-700">Signups are not open yet. Please check back later!</p>
    </div>
    </main>
  )
}
