interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
}

export default function TestimonialCard({
  quote,
  name,
  title,
}: TestimonialCardProps) {
  return (
    <div className="relative p-8 bg-[#111111] rounded-2xl border border-[#222222] group hover:border-[#f97316]/30 transition-colors duration-300">
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
        <div className="h-10 w-10 rounded-full bg-[#0f0f0f] border-2 border-[#f97316] flex items-center justify-center text-[#f97316]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>
      <blockquote className="text-xl italic text-[#f5f5f5]/90 font-serif">
        “{quote}”
      </blockquote>
      <div className="mt-4 text-[#f5f5f5]/70">
        <p className="font-medium font-serif">{name}</p>
        <p className="text-sm font-sans">{title}</p>
      </div>
      <div className="flex justify-center mt-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#f97316"
            className="mx-0.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    </div>
  );
}
