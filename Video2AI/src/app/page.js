
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CardContainer, CardItem, CardBody } from "@/components/ui/3d-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { HoverEffect} from "@/components/ui/card-hover-effect";
import { saveQuiz, deleteQuiz, generateTranscript } from "@/lib/api";
import { useUser, SignInButton } from '@clerk/nextjs';
import GetStartedButton from "@/components/ui/GetStartedButton";
import FAQSection from "@/components/ui/FaqSection";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function VideoToQuiz() {
 
    const words = [
        { text: "Engage your audience and improve knowledge retention with our powerful video to quiz conversion tool." },
    ];

    const items = [
        {
            title: "Upload Video",
            description: "Paste the link to your YouTube video and let us do the rest.",
            icon: <UploadIcon className="w-8 h-8 mb-4" />,
        },
        {
            title: "Answer Quiz",
            description: "Get generated quiz and attempt questions to check your knowledge.",
            icon: <FilePenIcon className="w-8 h-8 mb-4" />,
        },
        {
            title: "Save Quizzes",
            description: "Review the quiz whenever you want as it gets saved automatically.",
            icon: <ShareIcon className="w-8 h-8 mb-4" />,
        },
    ];

    return (

<div className="w-full min-h-screen bg-background text-foreground">
        <header className="container mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <PlayIcon className="w-6 h-6" />
            <span className="font-bold text-lg">Video to Quiz</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
              Features
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
              About
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
              Contact
            </Link>
          </nav>
         <GetStartedButton />
        </header>
        <main>
          <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Convert YouTube Videos to Interactive Quizzes
              </h1>

       <TypewriterEffect
        words={words}
        className="text-muted-foreground text-lg"
      />

            </div>

<HoverBorderGradient
      className="max-w-xl"
      containerClassName="rounded-lg overflow-hidden"
      duration={1}
      clockwise={true}
    >
        <div className="relative">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/ES6Xivbb6SI"        thumbnailSrc="/pic.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/ES6Xivbb6SI"        thumbnailSrc="/pic.png"
        thumbnailAlt="Hero Video"
      />
    </div>
    </HoverBorderGradient>


          </section>
          <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 bg-muted">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it Works</h2>
              <p className="text-muted-foreground text-lg">
                Our intuitive tool makes it easy to convert any YouTube video into an engaging quiz. Simply enter the
                video link and we will handle the rest.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <UploadIcon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Upload Video</h3>
                <p className="text-muted-foreground">Paste the link to your YouTube video and let us do the rest.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <FilePenIcon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Answer Quiz</h3>
                <p className="text-muted-foreground">Get generated quiz and attempt questions to check your knowledge.</p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <ShareIcon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Save Quizzes</h3>
                <p className="text-muted-foreground">Review the quiz whenever you want as it gets saved automatically.</p>
              </div>
            </div>

          </section>


        <FAQSection />
      </main>
      <footer className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayIcon className="w-6 h-6" />
          <span className="font-bold text-lg">Video to Quiz</span>
        </div>
        <nav className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
            Privacy
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
            Terms
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
            Contact
          </Link>
        </nav>
      </footer>
    </div>
    );
}


  function FilePenIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
      </svg>
    )
  }
  
  
  function PlayIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    )
  }
  
  
  function ShareIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
      </svg>
    )
  }
  
  
  function UploadIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
    )
  }
  
  
  function XIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    )
  }

