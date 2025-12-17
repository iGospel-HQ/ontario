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
import api from "@/lib/api-client";

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(11, "Subject too short"),
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
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    await api.post("/support/contact/create/", { ...data, contact_me: true });

    toast({
      title: "Message Sent!",
      description: "We’ll get back to you within 24 hours.",
    });

    reset();
  };

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-80 md:h-96 bg-gradient-to-br from-red-200 via-orange-100 to-pink-100 flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6"
        >
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            We usually reply the same day
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-background text-foreground">
        <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-5">
              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:igospelmediaconnect@gmail.com"
                      className="text-sm text-muted-foreground"
                    >
                      igospelmediaconnect@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-green-500 rounded-lg text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <a
                      href="https://wa.me/+2348068535646"
                      className="text-sm text-muted-foreground"
                    >
                      +234 806 853 5646
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-5 p-6">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-muted-foreground">
                      Lagos, Nigeria • Global Ministry
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-10">
              {["Instagram", "YouTube", "TikTok", "Facebook"].map(
                (platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="icon"
                    className="hover:border-red-500 hover:bg-red-100"
                    asChild
                  >
                    <a
                      href={`https://${platform.toLowerCase()}.com/gospelforce`}
                      target="_blank"
                    >
                      <Music className="w-5 h-5" />
                    </a>
                  </Button>
                )
              )}
            </div>
          </motion.div>

          {/* CONTACT FORM */}
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
                <CardDescription>
                  Music submission, partnership, prayer — we're here.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="John Doe" {...register("name")} />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Phone No</Label>
                    <Input
                      placeholder="090******34"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      rows={6}
                      placeholder="Write your message..."
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="py-20 bg-gradient-to-r from-red-200 to-orange-200 text-center">
        <Music className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <p className="text-2xl font-bold">The Gospel Never Sleeps</p>
        <p className="text-muted-foreground mt-2">
          We’re here 24/7 for the Kingdom
        </p>
      </div>
    </>
  );
}
