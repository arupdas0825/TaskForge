export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="text-muted-foreground max-w-md">
          We've sent you a verification link. Please check your email to confirm your account.
        </p>
        <p className="text-sm text-muted-foreground">If you don't see it, check your spam folder.</p>
      </div>
    </div>
  );
}
