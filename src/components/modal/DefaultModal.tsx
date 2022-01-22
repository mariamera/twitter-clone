import clsx from "clsx";
import React, { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  isOpen: boolean,
  onClick: () => void
};

export default function DefaultModal({ children, isOpen, onClick }: Props) {
  return (
    <>
      <div className={clsx("z-50 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full", !isOpen && "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">

          <div className="relative mx-auto p-5 border rounded-md bg-white w-3/4 z-50 top-1/4">
            <button onClick={onClick}>
              <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
            </button>
          {children}
          </div>
        </div>
      </div>
    </>
  )
}
