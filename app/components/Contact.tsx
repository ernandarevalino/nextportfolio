"use client";

import { useState } from "react";
import { submitContact } from "@/actions/portfolio";
import { BsGeoAlt, BsTelephone, BsEnvelope, BsSend } from "react-icons/bs";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error sending contact message:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#1f1f1f] text-white relative">
      
      {/* Background Subtle Spark Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.01] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <ScrollReveal delay={0}>
            <h2 className="text-3xl md:text-5xl font-black font-ubuntu tracking-tight text-white uppercase mt-4">
              Contact
            </h2>
            <p className="text-[#ececec]/60 mt-3 text-base md:text-lg max-w-xl mx-auto font-['Nunito']">
              Have an exciting opportunity, a complex challenge to solve, or just want to say hi? Send me a message!
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full">
          
          {/* Info Column (Left Side) */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={150}>
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl space-y-8 h-full transition-all duration-300">
                <div>
                  <h3 className="text-xl font-bold font-ubuntu mb-3 text-white tracking-wide uppercase border-b border-white/5 pb-2">Contact Info</h3>
                  <p className="text-sm md:text-base text-[#ececec]/60 leading-relaxed font-['Nunito']">
                    I'm responsive and happy to discuss new project initiatives, data integration, full stack architectures, or analytics consultancy.
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Location Tile */}
                  <div className="flex items-center gap-5 group/tile">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 text-[#ececec] rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-[#ececec] group-hover/tile:text-[#1f1f1f] group-hover/tile:scale-105 transition-all duration-300 shadow-md">
                      <BsGeoAlt className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-ubuntu text-white mb-0.5 tracking-wider uppercase">Location</h4>
                      <p className="text-sm text-[#ececec]/60 font-medium font-['Nunito']">Serpong, Tangerang Selatan</p>
                    </div>
                  </div>

                  {/* Phone Tile */}
                  <div className="flex items-center gap-5 group/tile">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 text-[#ececec] rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-[#ececec] group-hover/tile:text-[#1f1f1f] group-hover/tile:scale-105 transition-all duration-300 shadow-md">
                      <BsTelephone className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-ubuntu text-white mb-0.5 tracking-wider uppercase">Phone Number</h4>
                      <p className="text-sm text-[#ececec]/60 font-medium font-['Nunito']">+62 857-1020-9622</p>
                    </div>
                  </div>

                  {/* Email Tile */}
                  <div className="flex items-center gap-5 group/tile">
                    <div className="w-12 h-12 bg-white/5 border border-white/5 text-[#ececec] rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-[#ececec] group-hover/tile:text-[#1f1f1f] group-hover/tile:scale-105 transition-all duration-300 shadow-md">
                      <BsEnvelope className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-ubuntu text-white mb-0.5 tracking-wider uppercase">Email Address</h4>
                      <p className="text-sm text-[#ececec]/60 font-medium font-['Nunito'] truncate">ernandarevalino@gmail.com</p>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Column (Right Side) */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={300}>
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl space-y-8 transition-all duration-300">
                <div>
                  <h3 className="text-xl font-bold font-ubuntu mb-2 text-white tracking-wide uppercase border-b border-white/5 pb-2">Get In Touch</h3>
                  <p className="text-sm md:text-base text-[#ececec]/60 font-['Nunito']">Leave a brief note and I will get back to you within 24 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full bg-[#1f1f1f] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-all duration-300 ease-out focus:bg-white/[0.01]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className="w-full bg-[#1f1f1f] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-all duration-300 ease-out focus:bg-white/[0.01]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="w-full bg-[#1f1f1f] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-all duration-300 ease-out focus:bg-white/[0.01]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Message"
                      className="w-full bg-[#1f1f1f] border border-white/5 rounded-xl px-5 py-4 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-all duration-300 ease-out focus:bg-white/[0.01] resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Submit status response with high-fidelity elements */}
                  <div className="pt-2 text-center space-y-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Status labels */}
                    <div className="w-full md:w-auto text-left">
                      {status === "loading" && (
                        <div className="text-sm font-bold text-[#ececec]/60 animate-pulse font-['Nunito']">
                          Encrypting & transmitting message...
                        </div>
                      )}

                      {status === "success" && (
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 animate-fade-in font-['Nunito']">
                          Message sent successfully! Thank you.
                        </div>
                      )}

                      {status === "error" && (
                        <div className="text-xs font-bold text-rose-400 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 font-['Nunito']">
                          Error dispatching message. Please try again.
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full md:w-auto px-8 py-4 bg-[#ececec] text-[#1f1f1f] font-bold rounded-full hover:bg-white hover:scale-105 active:scale-95 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                    >
                      <span>Send Message</span>
                      <BsSend className="text-xs" />
                    </button>
                  </div>

                </form>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
