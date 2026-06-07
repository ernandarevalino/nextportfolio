"use client";

import { useState } from "react";
import { submitContact } from "@/actions/portfolio";
import { BsGeoAlt, BsTelephone, BsEnvelope } from "react-icons/bs";

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
    <section id="contact" className="py-20 bg-[#1f1f1f] text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="section-title text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-ubuntu tracking-wide text-white uppercase inline-block">
            Contact
          </h2>
          <p className="text-[#ececec]/70 mt-4 text-base md:text-lg">
            Feel free to reach out for questions, or just to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Info Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#232323] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-xl space-y-8 h-full">
              <div>
                <h3 className="text-2xl font-bold font-ubuntu mb-3 text-white">Contact Info</h3>
                <p className="text-sm md:text-base text-[#ececec]/70 leading-relaxed">
                  Don't hesitate to contact me. Whether it's a project idea, collaboration, or tech talk, I'm happy to connect!
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-[#ececec] hover:text-[#310606] transition-colors duration-300">
                    <BsGeoAlt className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-ubuntu text-white mb-1">Location</h4>
                    <p className="text-sm text-[#ececec]/80">Serpong, Tangerang Selatan</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-[#ececec] hover:text-[#310606] transition-colors duration-300">
                    <BsTelephone className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-ubuntu text-white mb-1">Phone Number</h4>
                    <p className="text-sm text-[#ececec]/80">+62 857-1020-9622</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-[#ececec] hover:text-[#310606] transition-colors duration-300">
                    <BsEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-ubuntu text-white mb-1">Email Address</h4>
                    <p className="text-sm text-[#ececec]/80 truncate">ernandarevalino@gmail.com</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-[#232323] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-ubuntu mb-2 text-white">Get In Touch</h3>
                <p className="text-sm md:text-base text-[#ececec]/70">Have any question? Feel free to reach out anytime.</p>
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
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
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
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
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
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
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
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit area with states */}
                <div className="pt-2 text-center space-y-4">
                  {status === "loading" && (
                    <div className="text-sm font-semibold text-[#ececec] animate-pulse">
                      Sending message...
                    </div>
                  )}

                  {status === "success" && (
                    <div className="text-sm font-bold text-green-400 bg-green-500/10 py-3 rounded-xl border border-green-500/20 animate-fade-in">
                      Your message has been sent. Thank you!
                    </div>
                  )}

                  {status === "error" && (
                    <div className="text-sm font-bold text-red-400 bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                      There was an error sending your message. Please make sure database is configured or try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full md:w-auto px-10 py-4 bg-[#ececec] text-[#310606] font-semibold rounded-full hover:bg-white hover:-translate-y-[2px] transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Send Message
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
