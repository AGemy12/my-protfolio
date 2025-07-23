"use client";

import { useState } from "react";
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
    <div className="container mx-auto md:w-full w-11/12 py-16" id="contact">
      <SectionTitle title="Contact Me" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <SimpleBtn
            title={isPending ? "Sending..." : "Send Message"}
            type="submit"
          />

          {success && (
            <p className="text-green-600 border-[1px] border-primary p-2 text-sm font-bold bg-main-bg shadow-light-shadow fixed bottom-4 left-4 flex items-center gap-2">
              Message sent successfully!
              <FaCheckSquare className="text-xl text-green-600" />
            </p>
          )}
        </form>
        <div className="flex items-center justify-end">
          <Image
            src={"/assets/media/contact/contact.png"}
            alt={"contact"}
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
