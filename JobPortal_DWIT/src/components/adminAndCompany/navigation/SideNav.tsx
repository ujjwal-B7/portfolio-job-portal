"use client";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import { useGetSingleRegisteredCompanyDetailsQuery } from "@/lib/store/features/registeredCompaniesApi";
import { RootState } from "@/lib/store/store";
import {
  File,
  Captions,
  Briefcase,
  HandCoins,
  UserSearch,
  Cpu,
  LandPlot,
  Component,
  BookOpenCheck,
  Building,
  Building2,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

interface SideNavLinksProps {
  icon?: any;
  link: string;
  name: string;
}

// interface SideNavProps {
//   setToggleNavbar?: (value: boolean) => void;
// }

const SideNav = () => {
  const pathname = usePathname();
  const { role, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const { data: registeredCompanyDetails } =
    useGetSingleRegisteredCompanyDetailsQuery(loggedInUserId, {
      skip: role === "admin",
    });
  const { data: profile, isLoading: isProfileLoading } =
    useGetSingleProfileDetailsByCreatorIdQuery(loggedInUserId, {
      skip: role === "admin",
    });

  const iconCss: React.CSSProperties = {
    width: "21px",
    height: "21px",
  };

  //only admin sidebar links array
  const only_admin_links: SideNavLinksProps[] = [
    {
      icon: <BookOpenCheck style={iconCss} />,
      link: `/admin/view/openToWork`,
      name: "Open To Work",
    },
    {
      icon: <Building style={iconCss} />,
      link: `/admin/view/registeredCompanies/pending`,
      name: "Registered Companies",
    },
  ];

  // company and admin side bar links
  const company_side_nav_links: SideNavLinksProps[] = [
    {
      icon: <File style={iconCss} />,
      link: `/${role}/view/${
        role === "admin" ? "jobApplications" : "job-applications"
      }`,
      name: "Job Application",
    },
    {
      icon: <Briefcase style={iconCss} />,
      link: `/${role}`,
      name: "Job",
    },
    // only for admin
    {
      icon: <Building2 style={iconCss} />,
      link: `/admin/view/company`,
      name: "Company",
    },
    {
      icon: <Captions style={iconCss} />,
      link: `/${role}/view/title`,
      name: "Title",
    },
    {
      icon: <LandPlot style={iconCss} />,
      link: `/${role}/view/domain`,
      name: "Domain",
    },
    {
      icon: <Cpu style={iconCss} />,
      link: `/${role}/view/technology`,
      name: "Technology",
    },
    {
      icon: <UserSearch style={iconCss} />,
      link: `/${role}/view/role`,
      name: "Role",
    },
    {
      icon: <HandCoins style={iconCss} />,
      link: `/${role}/view/salary`,
      name: "Salary",
    },
    {
      icon: <Component style={iconCss} />,
      link: `/${role}/view/type`,
      name: "Type",
    },
  ];

  // combining only_admin_links and    company_side_nav_links for admin
  const admin_side_nav_links: SideNavLinksProps[] = [
    ...only_admin_links,
    ...company_side_nav_links,
  ];

  const DynamicTag =
    (registeredCompanyDetails?.is_company_active && profile) || role === "admin"
      ? Link
      : "span";

  return (
    <nav
      className="sticky z-50 top-0 h-screen  w-60 bg-[#0F5288] text-white flex flex-col items-center justify-evenly font-switzer-regular sidenav"
      data-aos="fade-right"
      data-aos-duration="500"
    >
      <Link href={`/${role}`}>
        {" "}
        <Image
          src="/images/mobilelogo.png"
          width={202}
          height={53}
          alt="Deerwalk Jobs"
        />
      </Link>
      <div>
        <ul className="sidenav md:space-y-4 space-y-2 pt-4 pb-6 md:text-[1.1rem] font-semibold text-center overflow-y-auto h-[90vh]">
          {(role === "admin"
            ? admin_side_nav_links
            : company_side_nav_links
          ).map((link) => {
            // only rendering this link if role is admin
            if (link.name === "Company" && role !== "admin") {
              return null;
            }

            return (
              <li key={link.name}>
                <DynamicTag
                  key={link.name}
                  href={link.link}
                  className={`${
                    pathname === link.link
                      ? "active_link"
                      : "inactive_nav_links"
                  } `}
                >
                  <p className="w-56 flex items-center gap-2 ">
                    <span>{link.icon}</span>
                    {link.name}{" "}
                  </p>
                </DynamicTag>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
