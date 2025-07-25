import { FC } from "react";
import { Button } from "../ui/button";

const CTASection: FC = () => {  
    return (
        <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join millions of users who trust Cloud Chest with their most important files. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    );  
}

export default CTASection;