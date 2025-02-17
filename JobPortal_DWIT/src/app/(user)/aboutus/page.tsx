import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "About us",
};

export default function AboutUs() {
  return (
    <main className="bg-white font-switzer-regular">
      <div className="relative h-[458px] w-full">
        <Image
          src="/aboutus/image1.png"
          alt="About Us"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <section className="layout-container lg:py-20 md:py-10 lg:space-y-0 space-y-10 px-4">
        <div className="flex flex-col lg:flex-row justify-around items-center">
          <div className="lg:w-[40%] sm:w-[50%] p-6">
            <Image
              src="/images/ourmission.svg"
              alt="About US"
              width={548}
              height={316.42}
              className="rounded-md"
              data-aos="zoom-in"
            />
          </div>
          <div className="lg:w-[40%] lg:mt-0 mt-5">
            <h2 className="text-[1.25rem] lg:text-[2rem] text-center text-[#0F5288]">
              Our Mission
            </h2>
            <p className="mt-3 text-[0.875rem] lg:text-[18px] text-[#252525] text-justify leading-7 tracking-wide">
              At Deerwalk Jobs, our mission is to empower individuals to realize
              their potential in the IT field by providing access to
              thoughtfully selected job opportunities and resources. We aim to
              bridge the gap between talent and opportunity, fostering a vibrant
              community of professionals driving innovation and progress in the
              tech industry.
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-around items-center ">
          <div className="lg:w-[40%]">
            <h2 className="text-[1.25rem] lg:text-[2rem] text-center text-[#0F5288]">
              What We Offer?
            </h2>
            <p className="mt-3 text-[0.875rem] lg:text-[18px] text-[#252525] text-justify leading-7 tracking-wide">
              Our platform serves as a comprehensive job hub, connecting job
              seekers with esteemed IT firms offering roles in various domains
              such as Software Development, Software QA/QC, Data Analytics, and
              beyond. Whether you are a seasoned expert looking to advance your
              career or a recent graduate embarking on your IT journey, Deerwalk
              Jobs offers a diverse array of opportunities to explore and
              pursue.
            </p>
          </div>
          <div className="lg:w-[40%] sm:w-[50%] lg:mt-0 mt-5 p-6">
            <Image
              src="/images/whatweoffer.jpg"
              alt="About US"
              width={548}
              height={316.42}
              className="rounded-md"
              data-aos="zoom-in"
            />
          </div>
        </div>
        <div className="pt-10">
          <h2 className="lg:text-[2rem] text-2xl font-semibold text-center text-[#0F5288] lg:mb-10 mb-5">
            Why Choose Us?
          </h2>
          <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 place-items-center lg:gap-10 gap-7 px-4">
            {[
              {
                src: "/aboutus/industry-expertise.png",
                title: "Industry Expertise",
                description:
                  "With years of experience in the IT sector, we understand the intricacies of the industry and curate job listings accordingly.",
              },
              {
                src: "/aboutus/qa.png",
                title: "Quality Assurance",
                description:
                  "Each job listing on our platform undergoes a meticulous screening process to ensure relevance and credibility, providing job seekers with peace of mind.",
              },
              {
                src: "/aboutus/opportunities.png",
                title: "Diverse Opportunities",
                description:
                  "From entry-level positions to senior roles, our platform caters to individuals at every stage of their career journey, offering opportunities for growth and advancement.",
              },
              {
                src: "/aboutus/engagement.png",
                title: "Community Outreach",
                description:
                  "We believe in fostering a sense of community among IT professionals, offering networking opportunities, events & resources to support continuous learning and development.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="md:h-80 sm:h-72 bg-[#3573A3] rounded-md flex flex-col items-center py-8 px-4 mb-3 lg:mb-0"
                data-aos="zoom-in"
              >
                <Image src={item.src} width={30} height={32} alt={item.title} />
                <h3 className="mt-2 lg:mt-4 text-white text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 lg:mt-4  text-white text-base leading">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
