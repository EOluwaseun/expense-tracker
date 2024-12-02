import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// eslint-disable-next-line react/prop-types
export default function DialogueWrapper({ children }) {
  return (
    <Transition>
      <Dialog>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-25"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black/60"></div>
        </Transition>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-25"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              {children}
            </Transition>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
