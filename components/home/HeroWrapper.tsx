import { ChevronRight, FolderOpen, Play, Share2, Upload } from "lucide-react";
import type { FC } from "react";
import { Button } from "../ui/button";

const HeroWrapper: FC = () => {
	return (
		<section className="py-20 px-4">
			<div className="container mx-auto text-center">
				<div className="animate-fade-in-up">
					<h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
						Your Files,
						<br />
						<span className="text-primary">Everywhere</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						Store, sync, and share your files securely in the cloud. Access your
						content from any device, anywhere in the world.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button
							size="lg"
							className="transition-all duration-300 transform hover:scale-105 animate-glow"
						>
							Start Free Trial
							<ChevronRight className="w-4 h-4 ml-2" />
						</Button>
						<Button size="lg" variant="outline" className="group">
							<Play className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
							Watch Demo
						</Button>
					</div>
				</div>

				{/* Floating Elements */}
				<div className="relative mt-16">
					<div className="absolute top-10 left-10 animate-float">
						<div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
							<Upload className="w-8 h-8 text-primary" />
						</div>
					</div>
					<div
						className="absolute top-20 right-20 animate-float"
						style={{ animationDelay: "2s" }}
					>
						<div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
							<FolderOpen className="w-8 h-8 text-primary" />
						</div>
					</div>
					<div
						className="absolute bottom-10 left-1/4 animate-float"
						style={{ animationDelay: "4s" }}
					>
						<div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
							<Share2 className="w-8 h-8 text-primary" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroWrapper;
