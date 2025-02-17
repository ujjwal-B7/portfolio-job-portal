"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  const [visitorCount, setVisitorCount] = useState();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visitors/count`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setVisitorCount(data);
      });
  }, []);

  // Conditionally render the footer based on the pathname
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer
      id="footer"
      className="w-full px-0 bg-custom-blue text-white lg:mr-0"
    >
      <iframe
        width="100%"
        height="300"
        style={{ border: "0", marginBottom: "1rem" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.174201572078!2d85.34109798977576!3d27.711907227008187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1970d2e61067%3A0x1aa4921202ab29f8!2sDeerwalk%20Training%20Center!5e0!3m2!1sen!2snp!4v1690281126574!5m2!1sen!2snp"
      />
      <div className="flex items-start justify-between lg:mb-7 text-white px-4 md:py-7 py-5 md:flex-row flex-col md:gap-0 gap-7 layout-container">
        <div className="lg:space-y-16 space-y-8">
          <div>
            <div className="mb-2">
              <Image
                src="/images/footer-image.png"
                alt="Deerwalk Compware Ltd Logo"
                width={260}
                height={75}
              />
            </div>
            <p className="text-justify leading-6 pl-3">
              Ready to take the next step in your IT career?
            </p>
          </div>
          <p className="pl-3 tracking-wide">
            Total views <br />
            <strong className="tracking-widest text-3xl">{visitorCount}</strong>
          </p>
        </div>

        <div className="md:w-[317px]">
          <p className="md:pl-8 pl-4 font-semibold text-xl">Contact Us</p>
          <div className="md:space-y-5 space-y-3 mt-4">
            <div className="flex gap-5 md:pl-0 pl-4">
              <div className="flex-shrink-0 pt-1 relative size-4">
                <Image
                  src="/images/location-vector.png"
                  alt="Location"
                  width={18}
                  height={22}
                />
              </div>
              <p className="md:text-base text-[15px]">
                Sifal, Kathmandu, Nepal
              </p>
            </div>
            <div className="flex gap-5 md:pl-0 pl-4">
              <div className="flex-shrink-0 pt-1">
                <Image
                  src="/images/contact-vector.png"
                  alt="Location"
                  width={18}
                  height={22}
                />{" "}
              </div>
              <p className="md:text-base text-[15px]">
                01-5913021 , 01-4567153, +9779860422021, +9779765355167
              </p>
            </div>
            <div className="flex gap-5 md:pl-0 pl-4">
              <div className="flex-shrink-0 pt-1">
                <Image
                  src="/images/email-vector.png"
                  alt="Location"
                  width={18}
                  height={22}
                />
              </div>
              <p className="md:text-base text-[15px]">
                training@deerwalkcompware.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center md:mt-0 mt-6 gap-5">
        <Link
          href="https://www.linkedin.com/company/deerwalktrainingcenter/"
          target="blank"
          className="md:size-7 size-6 relative"
        >
          <Image src="/images/linkedin.png" fill alt="Linkedin"></Image>
        </Link>
        <Link
          href="https://www.facebook.com/deerwalktrainingcenter/"
          target="blank"
          className="md:size-7 size-6 relative"
        >
          <Image fill src="/images/facebook.png" alt="Facebook"></Image>
        </Link>
        <Link
          href="https://www.instagram.com/deerwalk.training.center/"
          target="blank"
          className="md:size-7 size-6 relative"
        >
          <Image src="/images/instagram.png" fill alt="Instagram"></Image>
        </Link>
        <Link
          href="https://www.threads.net/@deerwalk.training.center"
          target="blank"
          className="md:size-7 size-6 relative"
        >
          <Image src="/images/threads.png" fill alt="Threads"></Image>
        </Link>
        <Link
          href="https://www.youtube.com/@deerwalktrainingcenter"
          target="blank"
          className="md:size-7 size-6 relative"
        >
          <Image src="/images/youtube.png" fill alt="Youtube"></Image>
        </Link>
        <Link
          href="https://twitter.com/DeerwalkCenter"
          target="blank"
          className="md:size-6 size-5 relative"
        >
          <Image src="/images/x-white.png" fill alt="X"></Image>
        </Link>
      </div>
      <hr className="w-full max-w-screen-xl mx-auto mt-5"></hr>
      <p className=" text-sm text-center py-5">
        2025 Deerwalk Jobs. All Rights Reserved.
      </p>
    </footer>
  );
}
