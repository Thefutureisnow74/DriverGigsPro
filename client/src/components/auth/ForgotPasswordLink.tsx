import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ForgotPasswordLink() {
  return (
    <div className="text-center mt-4">
      <Link href="/password-reset">
        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800">
          Forgot your password?
        </Button>
      </Link>
    </div>
  );
}