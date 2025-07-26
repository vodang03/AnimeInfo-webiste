import React from "react";

type SubMenuItem = {
  label: string;
  value: string;
};

interface MenuItem {
  label: string;
  value?: string;
  dropdown?: SubMenuItem[];
}

interface NavMenuProps {
  pathname: string;
  menuItems: MenuItem[];
  hovered: string | null;
  setHovered: (value: string | null) => void;
  onSelectAnimeOption: (label: string) => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
  pathname,
  menuItems,
  hovered,
  setHovered,
  onSelectAnimeOption,
}) => {
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="justify-center flex-1 hidden md:flex">
      <ul className="flex items-center space-x-8 text-lg font-medium text-gray-800">
        {menuItems.map((item) => (
          <li
            key={item.value}
            className="relative cursor-pointer hover:text-indigo-600 transition"
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              if (item.value === "Home") {
                onSelectAnimeOption(item.value);
              }
            }}
          >
            {item.label}
            {item.dropdown && hovered === item.label && (
              <ul className="absolute top-full left-0 bg-white rounded-lg shadow-lg border border-gray-200 text-sm w-48 z-20 overflow-hidden">
                {item.dropdown.map((subItem) => (
                  <li
                    key={subItem.label}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => onSelectAnimeOption(subItem.value)}
                  >
                    {subItem.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
