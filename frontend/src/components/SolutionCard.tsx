import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function SolutionCard({
  icon,
  title,
  description,
  features,
}: SolutionCardProps) {
  return (
    <div className="group relative bg-gradient-to-b from-[#111111] to-[#0a0a0a] rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f97316]/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
      <Card className="border-0 bg-[#0f0f0f] h-full rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="h-12 w-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center mb-4 text-[#f97316]">
            {icon}
          </div>
          <CardTitle className="text-xl font-serif font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-[#f5f5f5]/70 text-base font-sans">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-[#f5f5f5]/80 font-sans"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="p-0 text-[#f97316] hover:text-[#f97316] hover:bg-transparent group-hover:translate-x-1 transition-transform duration-300 font-sans"
          >
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
