import { FC } from "react";

const StatsWrapper: FC = () => {

    const stats = [
        { number: "100M+", label: "Files Stored" },
        { number: "50K+", label: "Active Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "256-bit", label: "Encryption" }
    ];


    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {stat.number}
                            </div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StatsWrapper;