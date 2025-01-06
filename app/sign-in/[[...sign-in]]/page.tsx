import { SignIn } from '@clerk/nextjs';


export default function SignInPage() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-fuchsia-100">
      <SignIn />
    </div>
  );
}
