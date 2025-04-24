
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { HelpCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/integrations/supabase/client";

const faqItems = [
  {
    question: "How does Annive handle subscription changes?",
    answer: "All subscription changes (upgrades and downgrades) are managed inside Annive, without redirecting you to Stripe Checkout. When you select a new plan, a confirmation popup appears showing the price difference. If upgrading, you are charged only for the remaining time in your current billing cycle, and any unused time is credited. If downgrading, your current plan remains active until the next billing cycle."
  },
  {
    question: "Can I switch from monthly to yearly billing?",
    answer: "Yes! When upgrading or downgrading, you can choose to switch to annual billing. The discount percentage is dynamically fetched from our pricing settings. When switching, your payment method on file will be used, and the change takes effect immediately."
  },
  {
    question: "Why am I still seeing my old plan after upgrading?",
    answer: "Subscription updates are processed instantly, but sometimes a page refresh is needed to reflect the change. If you still see the old plan, try refreshing your subscription settings or logging out and back in. If the issue persists, contact support."
  },
  {
    question: "Can I update my payment method?",
    answer: "Yes, you can update your payment method at any time. The new card will replace the old one and be used for all future charges. Only one payment method is stored per account to avoid duplicates."
  },
  {
    question: "What happens if my payment fails?",
    answer: "If a payment fails, Annive will notify you and attempt to charge the default payment method again. If the issue persists, your subscription may be paused until a valid payment method is added."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel at any time. If you cancel, your subscription remains active until the end of the billing cycle. You will not be charged again unless you reactivate."
  },
  {
    question: "How does Annive handle data security?",
    answer: "Annive follows strict security protocols and uses encrypted connections to protect your data. We do not store payment details directly—Stripe handles all transactions securely."
  },
  {
    question: "How do I add or remove users from my account?",
    answer: "You can manage users in your account settings. When a new user is added, they will receive an invitation to join Annive. Removing a user will revoke their access immediately."
  },
  {
    question: "Does Annive integrate with my existing tools?",
    answer: "Yes! Annive integrates with platforms like Slack, Microsoft Teams, and Google Workspace to send reminders and automate notifications."
  },
  {
    question: "Can I customize reminders and notifications?",
    answer: "Absolutely! You can customize when and how reminders are sent, including selecting specific channels for notifications."
  }
];

interface SupportFormData {
  email: string;
  subject: string;
  message: string;
}

const SupportPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<SupportFormData>({
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke("send-support-email", {
        body: {
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          userId: user?.id || null,
        },
      });
      
      if (error) {
        console.error("Error submitting support request:", error);
        toast.error("Failed to send support request. Please try again.");
        return;
      }
      
      toast.success("Support request sent successfully!");
      setFormData({
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error in send-support-email function:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-6xl px-4 py-8">
      <PageHeader
        title="Support"
        description="Get help with your Annive account"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Contact Support</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Your Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  disabled={!!user}
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's your question about?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your question or issue in detail..."
                  rows={5}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
