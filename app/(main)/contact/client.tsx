// app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Form Schema with Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is too short"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate sending (replace with Formspree, EmailJS, Resend, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours. God bless you!",
    });

    reset();
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-80 md:h-96 bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">We reply fast — usually same day</p>
        </motion.div>
      </section>

      <section className="py-16 bg-black text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>

              <div className="space-y-5">
                <Card className="">
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:hello@gospelforce.com" className="text-sm text-gray-400">
                      hello@gospelforce.com
                    </a>
                  </div>
                </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-green-500 rounded-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">WhatsApp</p>
                      <a href="https://wa.me/2348123456789" className="text-sm text-gray-400">
                        +234 812 345 6789
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-sm text-gray-400">Lagos, Nigeria • Global Ministry</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-10">
                {["Instagram", "YouTube", "TikTok", "Facebook"].map((platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="icon"
                    className="border-gray-700 hover:border-red-600 hover:bg-red-900/20"
                    asChild
                  >
                    <a href={`https://${platform.toLowerCase()}.com/gospelforce`} target="_blank">
                      <Music className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form with shadcn + Zod */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Send className="w-7 h-7 text-red-500" />
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Music submission, partnership, prayer request — we're here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="bg-black/50 border-gray-700 focus:border-red-500"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-black/50 border-gray-700 focus:border-red-500"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g. Submit My Song, Partnership, Prayer"
                      className="bg-black/50 border-gray-700 focus:border-red-500"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={6}
                      className="bg-black/50 border-gray-700 focus:border-red-500 resize-none"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-sm mt-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-bold uppercase tracking-wider"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Closing Gospel Touch */}
      <div className="py-20  bg-gradient-to-r from-red-900 to-orange-900  text-center">
        <Music className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <p className="text-2xl font-bold text-white">The Gospel Never Sleeps</p>
        <p className="text-gray-400 mt-2">We’re here 24/7 for the Kingdom</p>
      </div>
    </>
  );
}