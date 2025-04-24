import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Github,
  LifeBuoy,
  GraduationCap,
  Menu,
  MessageSquare,
  BrainCircuit,
  Twitter,
  X,
  Youtube,
  Briefcase,
  Target,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Index = () => {
  const [activeAccordion, setActiveAccordion] = React.useState<string | null>(
    null
  );
  const isMobile = useIsMobile();

  const toggleAccordion = (value: string) => {
    setActiveAccordion(activeAccordion === value ? null : value);
  };

  const navLinks = [
    { name: "About", section: "about" },
    { name: "Features", section: "features" },
    { name: "Pricing", section: "pricing" },
    { name: "FAQ", section: "faq" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const youtubeVideos = [
    {
      id: "video1",
      title: "BigTechMoney AI Tutor - 5 Things",
      description: "Learn key strategies around our AI.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/dazEua8gw1c",
    },
    {
      id: "video2",
      title: "BigTechMoney - Career Translation",
      description:
        "Navigate the tech job market with our AI-powered career coach.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/Es1EfC66a1o",
    },
    {
      id: "video3",
      title: "BigTechMoney - 5 things",
      description: "Master the STAR method of BigTechMoney.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/0Qb7pIgzLDQ",
    },
    {
      id: "video4",
      title: "BigTechMoney - 5 Services",
      description: "Learn about our 5 services.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/uUoH4vAR5Xs",
    },
    {
      id: "video5",
      title: "BigTechMoney - Keep it Simple",
      description: "Master the STAR method of BigTechMoney.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/AlHDN0jQfRc",
    },
    {
      id: "video6",
      title: "BigTechMoney - Are you STILL guessing?",
      description: "Stop guessing and start preparing.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600",
      youtubeUrl: "https://youtu.be/ZJLcbmfib5c",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="section-container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
            to="/"
          >
            BigTechMoney
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => scrollToSection(link.section)}
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[60vh]">
                <div className="p-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </DrawerClose>
                  </div>

                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <DrawerClose key={link.section} asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-lg"
                          onClick={() => scrollToSection(link.section)}
                        >
                          {link.name}
                        </Button>
                      </DrawerClose>
                    ))}
                    <DrawerClose asChild>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        <Link to="/auth" className="w-full">
                          Get Started
                        </Link>
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 section-container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your Path to a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Top Tech Career
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered career coaching to help you land your dream job at
            leading tech companies like Google, Microsoft, Amazon, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-base px-8 py-6 h-auto">
              <Link to="/auth" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl">
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200"
                alt="AI Career Coaching Platform"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="section-container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose BigTechMoney?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your personal AI career coach that helps you navigate the
              competitive tech job market.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Coaching</h3>
              <p className="text-gray-600">
                Get personalized feedback on your resume, interview responses,
                and technical skills from our advanced AI.
              </p>
            </div>
            <div
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interview Practice</h3>
              <p className="text-gray-600">
                Practice with real interview questions from top tech companies
                and receive instant feedback.
              </p>
            </div>
            <div
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Job Strategy</h3>
              <p className="text-gray-600">
                Get matched with relevant job openings and learn proven
                strategies for landing offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="section-container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Career Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to prepare for your dream tech role.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-fade-up order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4">
                Resume & Profile Optimization
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI analyzes your resume and provides actionable feedback to
                make it stand out to tech recruiters.
              </p>
              <ul className="space-y-3">
                {[
                  "AI-powered resume analysis",
                  "Keyword optimization",
                  "ATS-friendly formatting",
                  "LinkedIn profile enhancement",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-violet-100 p-2 rounded-xl order-1 md:order-2 animate-fade-up">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80&w=600"
                  alt="Resume Analysis"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-r from-violet-100 to-blue-100 p-2 rounded-xl animate-fade-up">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
                  alt="Interview Practice"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="animate-fade-up">
              <h3 className="text-2xl font-bold mb-4">
                Mock Interview Simulator
              </h3>
              <p className="text-gray-600 mb-6">
                Practice with our AI interviewer that simulates real technical
                and behavioral interviews from top tech companies.
              </p>
              <ul className="space-y-3">
                {[
                  "Technical interview practice",
                  "Behavioral question preparation",
                  "System design interviews",
                  "Real-time feedback",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Guides Section */}
      <section id="guides" className="py-20 bg-gray-50">
        <div className="section-container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Video Guides & Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch our expert tutorials to help you make informed investment
              decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {youtubeVideos.map((video) => (
              <a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Youtube className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            {/* <Button className="bg-red-600 hover:bg-red-700">
              <Youtube className="mr-2" />
              View All Video Guides
            </Button> */}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="section-container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investment in Your Future
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your career goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              className="animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Monthly</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$249</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Perfect for those just starting their tech career journey.
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Resume analysis",
                    "Basic interview prep",
                    "Job search guidance",
                    "Email support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card
              className="relative border-blue-600 shadow-lg animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                DISCOUNTED
              </div>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* <h3 className="text-lg font-semibold mb-2">Pro</h3> */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      $99{" "}
                      <span className="text-xs text-gray-300">
                        (After 4 months of $249)
                      </span>
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    For serious candidates targeting top tech companies.
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Basic",
                    "Advanced interview simulations",
                    "System design practice",
                    "Personal roadmap",
                    "Priority support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card
              className="animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Yearly</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$1249</span>
                    <span className="text-gray-500">/year</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Complete preparation with personalized coaching.
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in Pro",
                    "1-on-1 mentorship",
                    "Mock interviews with experts",
                    "Career strategy sessions",
                    "Lifetime access to resources",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="section-container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our tech career coaching.
            </p>
          </div>
          <div className="max-w-3xl text-left mx-auto animate-fade-up">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How does the AI interview coaching work?",
                  answer:
                    "Our AI simulates real interview scenarios using questions from actual tech interviews. It provides instant feedback on your answers, helping you improve your responses and identify areas for improvement.",
                },
                {
                  question: "Can I get a refund if I'm not satisfied?",
                  answer:
                    "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with our service, we'll provide a full refund, no questions asked.",
                },
                {
                  question: "How long does it take to see results?",
                  answer:
                    "While everyone's journey is different, most users see significant improvements in their interview performance within 4-6 weeks of consistent practice. Many have received job offers from top tech companies within 3 months.",
                },
                {
                  question: "Do you offer mock interviews with real people?",
                  answer:
                    "Yes, our Elite plan includes mock interviews with experienced tech professionals who have worked at top companies. They provide detailed feedback and insights from their experience.",
                },
                {
                  question: "What kind of success rate do your students have?",
                  answer:
                    "Over 70% of our active users who complete our recommended preparation program receive offers from major tech companies within 6 months. Our comprehensive approach has helped thousands land roles at companies like Google, Amazon, and Microsoft.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 text-left py-4 hover:bg-gray-50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="section-container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Launch Your Tech Career?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of successful candidates who landed their dream
              tech jobs with BigTechMoney.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-base px-8 py-6 h-auto">
              <Link to="/auth">Start Your Journey Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 w-full py-12">
        <div className="section-container px-4 md:px-6">
          <div className="flex justify-between mb-8">
            <div>
              <h3 className="text-xl text-left font-bold text-white mb-4">
                BigTechMoney
              </h3>
              <p className="text-gray-400 max-w-sm text-left mb-4">
                Making tech investing smarter, easier, and more profitable.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Youtube className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LifeBuoy className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white text-left font-semibold mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-left">
                {["Features", "Pricing", "Testimonials", "API"].map(
                  (item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-gray-400  hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} BigTechMoney. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
