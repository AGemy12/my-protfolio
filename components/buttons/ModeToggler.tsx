// "use client";

// import Tooltip from "../helpers/ToolTip";
// import { useTheme } from "@/contexts/ThemeContext";
// import { IoMoon, IoSunny } from "react-icons/io5";

// export default function ModeToggler() {
//   const { theme, toggleTheme } = useTheme();

//   return (
// <div className="fixed top-4 right-4 z-50">
//   <Tooltip content="Toggle Mode">
//     <button
//       onClick={toggleTheme}
//       className="w-[52px] h-[28px] rounded-full bg-border relative flex items-center transition-colors   duration-300"
//     >
//       <div
//         className={`absolute  w-[24px] h-[24px] rounded-full shadow-md flex items-center justify-center bg-white  transition-all duration-300 ${
//           theme === "dark" ? "translate-x-[26px]" : "translate-x-[2px]"
//         }`}
//       >
//         {theme === "dark" ? (
//           <IoSunny className="text-yellow-400 text-sm" />
//         ) : (
//           <IoMoon className="text-[#0ea5ea] text-sm" />
//         )}
//       </div>
//     </button>
//   </Tooltip>
// </div>
//   );
// }
