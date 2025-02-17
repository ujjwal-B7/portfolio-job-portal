"use client";

import { useRef, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";

import Link from "next/link";

import Image from "next/image";

import { usePathname } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

import { useGetSingleProfileDetailsByCreatorIdQuery } from "@/lib/store/features/profileApi";
import useToggle from "@/hooks/useToggle";
import UserDropdown from "../UserDropdown";
import MobileSidebar from "../MobileSidebar";

export interface NavLinksProps {
  link: string;
  name: string;
  subMenus?: any;
}

//navigation links
const nav_links: NavLinksProps[] = [
  {
    link: "/",
    name: "Home",
  },
  {
    link: "/aboutus",
    name: "About Us",
  },
  // {
  //   link: "https://forms.gle/dxQRoBqvz2RNMTi27",
  //   name: "Join Job Fair (Students)",
  // },
  // {
  //   link: "https://forms.gle/Gt7Juq5fHoi8u8zCA",
  //   name: "Join Job Fair (Companies)",
  // },
];

const Navbar = () => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLButtonElement>(null);
  const [
    showUserDropwdownOption,
    setShowUserDropdownOption,
    setCloseUserDropdownOption,
  ] = useToggle();
  const { loggedInUserToken, name, email, loggedInUserId } = useSelector(
    (state: RootState) => state.authenticated
  );

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen, setCloseMobileMenuOpen] =
    useToggle();

  const { data: profile } = useGetSingleProfileDetailsByCreatorIdQuery(
    loggedInUserId,
    {
      skip: !loggedInUserId,
    }
  );

  //toggling the sidebar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!profileDropdownRef?.current?.contains(target)) {
        setCloseUserDropdownOption();
      }
      if (!mobileMenuRef?.current?.contains(target)) {
        setCloseMobileMenuOpen();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [profileDropdownRef, setCloseMobileMenuOpen, setCloseUserDropdownOption]);

  return (
    <>
      <nav className="z-[1000] w-full lg:shadow-[0_2px_8px_rgba(0,0,0,0.1)] sticky top-0 lg:bg-white bg-[#0F5288] font-arial-rounded-regular">
        <section className=" layout-container px-4 h-20 flex justify-between items-center">
          <Link className="lg:block hidden" href="/">
            <Image
              src="/images/DWJ.png"
              alt="Deerwalk Logo"
              width={256}
              height={100}
              priority
            />
          </Link>
          <Link className="lg:hidden" href="/">
            <Image
              src="/images/DeerwalkMobile.png"
              alt="Deerwalk Logo"
              width={65}
              height={65}
              priority
            />
          </Link>

          <div className="flex">
            <button onClick={setIsMobileMenuOpen}>
              {!isMobileMenuOpen && <Menu size={24} className="text-white" />}
            </button>
            <ul className="lg:flex items-center hidden gap-3 lg:text-[#2D2D2D]">
              {nav_links.map((nav_link) => (
                <li key={nav_link.name} className=" py-10">
                  <Link
                    className={` lg:hover:bg-gray-100 ${
                      nav_link.name
                    } relative  px-2 py-1 rounded-md ${
                      pathname === `${nav_link.link}` ? "bg-gray-100" : ""
                    }`}
                    href={nav_link.link}
                  >
                    {nav_link.name}
                  </Link>
                </li>
              ))}

              {loggedInUserToken ? (
                <>
                  <Link
                    className={` lg:hover:bg-gray-100 rounded-md py-1 px-2 
                      ${pathname === "/job/applications" && "bg-gray-100"}
                      `}
                    href="/job/applications"
                  >
                    Applied Jobs
                  </Link>
                  <JobFairRegisterButton />
                  <button
                    ref={profileDropdownRef}
                    className="w-11 h-11 rounded-full bg-gray-100 relative"
                    onClick={setShowUserDropdownOption}
                  >
                    {profile ? (
                      <Image
                        fill
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile?.logo}`}
                        alt={profile?.name}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      "U"
                    )}

                    {/* user dropdown */}
                    {showUserDropwdownOption && <UserDropdown />}
                  </button>
                </>
              ) : (
                <>
                  {/* dropdowns */}
                  <li className="group py-10">
                    <Link
                      className={` lg:hover:bg-slate-100 relative  px-2 py-1 rounded-md`}
                      href=""
                    >
                      <span className="-mr-0.5">Login </span>
                      <ChevronDown className="inline-block size-4 group-hover:-rotate-180 transition-all" />
                      <div className="hidden group-hover:block shadow_div absolute  bg-white p-1 space-y-1 py-3 top-14 -left-12 w-36">
                        <li>
                          <Link
                            className="block hover:bg-gray-100 p-1 rounded-md"
                            href="/employee/login"
                          >
                            As an employee
                          </Link>
                        </li>
                        <hr className="my-1" />
                        <li>
                          <Link
                            className="block hover:bg-gray-100 p-1 rounded-md"
                            href="/company/login"
                          >
                            As a company
                          </Link>
                        </li>
                      </div>
                    </Link>
                  </li>
                  <li className="group py-10">
                    <Link
                      className={` lg:hover:bg-slate-100 relative  px-2 py-1 rounded-md`}
                      href=""
                    >
                      <span className="-mr-0.5">Register </span>
                      <ChevronDown className="inline-block size-4 group-hover:-rotate-180 transition-all" />
                      <div className="hidden group-hover:block shadow_div absolute  bg-white p-1 space-y-1 py-3 top-14 -left-12 w-36">
                        <li>
                          <Link
                            className="block hover:bg-gray-100 p-1 rounded-md"
                            href="/employee/register"
                          >
                            As an employee
                          </Link>
                        </li>
                        <hr className="my-1" />
                        <li>
                          <Link
                            className="block p-1 hover:bg-gray-100  rounded-md"
                            href="/company/register"
                          >
                            As a company
                          </Link>
                        </li>
                      </div>
                    </Link>
                  </li>
                  <JobFairRegisterButton />
                </>
              )}
            </ul>
          </div>
        </section>
      </nav>

      {/*Mobile Menu*/}
      <MobileSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        mobileMenuRef={mobileMenuRef}
        profile={profile}
        nav_links={nav_links}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        loggedInUserToken={loggedInUserToken}
        pathname={pathname}
        loggedInUserId={loggedInUserId}
        name={name}
        email={email}
      />
    </>
  );
};

export default Navbar;

export const JobFairRegisterButton = () => {
  const [showJobFairLinks, setShowJobFairLinks] = useToggle();

  const toggleDropdown = () => {
    setShowJobFairLinks();
  };

  return (
    <div
      className="group lg:py-10 cursor-pointer"
      onMouseEnter={() => {
        if (window.innerWidth >= 1024) setShowJobFairLinks(); // Show dropdown on hover for large screens
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 1024) setShowJobFairLinks(); // Hide dropdown on hover leave for large screens
      }}
    >
      <li
        className={`lg:hover:bg-hover-blue/90 bg-hover-blue text-white relative  px-2 py-2 rounded-md text-sm`}
        onClick={() => {
          if (window.innerWidth < 1024) toggleDropdown(); // Toggle dropdown on click for small screens
        }}
      >
        <span>Job Fair 2025 Registration</span>
        <ChevronDown
          className={`inline-block size-4 transition-transform ${
            showJobFairLinks ? "-rotate-180" : "rotate-0"
          }`}
        />
        {showJobFairLinks && (
          <div
            className={`shadow_div absolute  bg-white p-1 space-y-1 py-3  ${
              window.innerWidth < 1024
                ? "w-full right-0.5 top-11"
                : "w-36 top-14 right-16"
            }  text-gray-900`}
          >
            <li>
              <Link
                href="https://forms.gle/dxQRoBqvz2RNMTi27"
                target="_blank"
                className="block hover:bg-gray-100 p-1 rounded-md"
              >
                Student
              </Link>
            </li>
            <hr className="my-1" />
            <li>
              <Link
                target="_blank"
                className="block hover:bg-gray-100 p-1 rounded-md"
                href="https://forms.gle/Gt7Juq5fHoi8u8zCA"
              >
                Company
              </Link>
            </li>
          </div>
        )}
      </li>
    </div>
  );
};
