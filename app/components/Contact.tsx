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

  // Data kontak untuk link dinamis
  const contactInfo = {
    location: "Serpong, Tangerang Selatan",
    mapsLink: "https://maps.google.com/?q=Serpong,+Tangerang+Selatan", // Sesuaikan link spesifik jika ada
    phone: "+62 857-1020-9622",
    whatsappLink: "https://wa.me/6285710209622",
    email: "ernandarevalino@gmail.com",
    emailLink: "mailto:ernandarevalino@gmail.com"
  };

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
                  <h3 className="text-xs font-bold font-ubuntu mb-3 text-white/30 tracking-wider uppercase border-b border-white/5 pb-3">Contact Info</h3>
                  <p className="text-sm md:text-base text-[#ececec]/60 leading-relaxed font-['Nunito']">
                    I'm responsive and happy to discuss new project initiatives, data integration, full stack architectures, or analytics consultancy.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Location Tile (Link) */}
                  <a 
                    href={contactInfo.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 group/tile p-2 -mx-2 rounded-2xl hover:bg-white/[0.02] transition-all duration-300 w-full text-left"
                  >
                    <div className="w-12 h-12 bg-white/[0.02] border border-white/5 text-white/50 rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-white/[0.08] group-hover/tile:border-white/20 group-hover/tile:text-white transition-all duration-300">
                      <BsGeoAlt className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-ubuntu text-white/40 mb-0.5 tracking-wider uppercase group-hover/tile:text-white/60 transition-colors duration-300">Location</h4>
                      <p className="text-sm text-white/70 group-hover/tile:text-white font-medium font-['Nunito'] transition-colors duration-300">{contactInfo.location}</p>
                    </div>
                  </a>

                  {/* Phone/WhatsApp Tile (Link) */}
                  <a 
                    href={contactInfo.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 group/tile p-2 -mx-2 rounded-2xl hover:bg-white/[0.02] transition-all duration-300 w-full text-left"
                  >
                    <div className="w-12 h-12 bg-white/[0.02] border border-white/5 text-white/50 rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-white/[0.08] group-hover/tile:border-white/20 group-hover/tile:text-white transition-all duration-300">
                      <BsTelephone className="text-lg" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-ubuntu text-white/40 mb-0.5 tracking-wider uppercase group-hover/tile:text-white/60 transition-colors duration-300">Phone Number</h4>
                      <p className="text-sm text-white/70 group-hover/tile:text-white font-medium font-['Nunito'] transition-colors duration-300">{contactInfo.phone}</p>
                    </div>
                  </a>

                  {/* Email Tile (Link) */}
                  <a 
                    href={contactInfo.emailLink}
                    className="flex items-center gap-5 group/tile p-2 -mx-2 rounded-2xl hover:bg-white/[0.02] transition-all duration-300 w-full text-left"
                  >
                    <div className="w-12 h-12 bg-white/[0.02] border border-white/5 text-white/50 rounded-2xl flex items-center justify-center shrink-0 group-hover/tile:bg-white/[0.08] group-hover/tile:border-white/20 group-hover/tile:text-white transition-all duration-300">
                      <BsEnvelope className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold font-ubuntu text-white/40 mb-0.5 tracking-wider uppercase group-hover/tile:text-white/60 transition-colors duration-300">Email Address</h4>
                      <p className="text-sm text-white/70 group-hover/tile:text-white font-medium font-['Nunito'] truncate transition-colors duration-300">{contactInfo.email}</p>
                    </div>
                  </a>

                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Column (Right Side) */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={300}>
              <div className="bg-gradient-to-br from-[#232323] to-[#202020] p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl space-y-8 transition-all duration-300">
                <div>
                  <h3 className="text-xs font-bold font-ubuntu mb-2 text-white/30 tracking-wider uppercase border-b border-white/5 pb-3">Get In Touch</h3>
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

                  {/* Submit status response */}
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
                      className="w-full md:w-auto px-8 py-4 bg-[#ececec] text-[#1f1f1f] font-bold rounded-full hover:bg-white active:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
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