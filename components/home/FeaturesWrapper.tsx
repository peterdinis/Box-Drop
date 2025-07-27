import { Cloud, Shield, Users, Zap } from "lucide-react";
import type { FC } from "react";
import { Card } from "../ui/card";

const FeaturesWrapper: FC = () => {
	const features = [
		{
			icon: <Cloud className="w-8 h-8" />,
			title: "Cloud Storage",
			description:
				"Store your files securely in the cloud with unlimited access from anywhere.",
		},
		{
			icon: <Shield className="w-8 h-8" />,
			title: "Secure & Private",
			description:
				"Enterprise-grade security with end-to-end encryption for all your files.",
		},
		{
			icon: <Zap className="w-8 h-8" />,
			title: "Lightning Fast",
			description:
				"Upload and sync your files at blazing speeds with our optimized infrastructure.",
		},
		{
			icon: <Users className="w-8 h-8" />,
			title: "Team Collaboration",
			description: "Share folders and collaborate with your team in real-time.",
		},
	];

	return (
		<section className="py-20 px-4">
			<div className="container mx-auto">
				<div className="text-center mb-16 animate-fade-in-up">
					<h2 className="text-4xl font-bold mb-4">
						Everything you need for
						<span className="text-primary"> file management</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Powerful features designed to make your file storage and sharing
						experience seamless and secure.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="p-6 text-center hover:shadow-hover transition-all duration-300 group cursor-pointer animate-scale-in"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300 flex justify-center">
								{feature.icon}
							</div>
							<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
							<p className="text-muted-foreground">{feature.description}</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturesWrapper;
