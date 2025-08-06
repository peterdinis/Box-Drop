import { SignIn } from "@clerk/nextjs";
import AuthWrapper from "@/components/auth/AuthWrapper";

export default function Page() {
	return (
		<AuthWrapper>
			<SignIn />
		</AuthWrapper>
	);
}
