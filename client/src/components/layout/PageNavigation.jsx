import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const PageNavigation = ({ paths }) => {
  return (
    <nav className="bg-gray-900 flex items-center text-sm text-gray-400 space-x-2 mb-6">
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          )}
          {path.to ? (
            <Link
              to={path.to}
              className="hover:text-blue-400 transition hover:underline"
            >
              {path.name}
            </Link>
          ) : (
            <span className="text-white font-medium">{path.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default PageNavigation;
