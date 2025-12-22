"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SectionTitle from "../global/SectionTitle";
import emailjs from "emailjs-com";
import TextInput from "../global/TextInput";

import { FaCheckSquare } from "react-icons/fa";
import Image from "next/image";
import SimpleBtn from "../buttons/SimpleBtn";

const SERVICE_ID = "service_7461ifs";
const TEMPLATE_ID = "template_oyj3oxi";
const PUBLIC_KEY = "YpQSxGtzz2bm73j3B";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Valid email is required"
          : "";
      case "phone":
        return !/^\+?[0-9]{7,15}$/.test(value) ? "Valid phone is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMsg = validateField(name, value);
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setSuccess(false);

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
    if (hasErrors) {
      setIsPending(false);
      return;
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section
      className="container mx-auto md:w-full w-11/12 py-16 md:py-24 lg:py-32"
      id="contact"
    >
      <SectionTitle title="Contact Me" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-main-bg p-8 md:p-10 rounded-2xl border-2 border-primary-20 shadow-lg"
        >
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">
              Let&apos;s Work Together
            </h2>
            <p className="text-muted text-sm md:text-base">
              Have a project in mind? I&apos;d love to hear from you. Send me a
              message and I&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <TextInput
              type="text"
              name="name"
              placeholder="Your Name"
              isReq
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <TextInput
              type="email"
              name="email"
              placeholder="Your Email"
              isReq
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <TextInput
              type="text"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <TextInput
              type="text"
              name="message"
              placeholder="Your Message"
              isTextArea
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <SimpleBtn
            title={isPending ? "Sending..." : "Send Message"}
            type="submit"
          />

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 text-green-600 border-2 border-green-500/30 rounded-lg bg-green-500/10 flex items-center gap-3"
            >
              <FaCheckSquare className="text-xl text-green-600 flex-shrink-0" />
              <span className="text-sm font-semibold">
                Message sent successfully!
              </span>
            </motion.div>
          )}
        </motion.form>

        {/* Contact Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center lg:justify-end"
        >
          <div className="relative">
            <Image
              src="/assets/media/contact/contact.png"
              alt="Contact illustration"
              width={600}
              height={600}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto object-contain"
              priority={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
