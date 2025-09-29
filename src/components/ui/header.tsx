import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { PrivyLogo } from "./privy-logo";
import { BaseLogo } from "./base-logo";

export function Header() {
  return (
    <header className="h-[60px] flex flex-row justify-between items-center px-6 border-b bg-white border-[#E2E3F0]">
      <div className="flex flex-row items-center gap-3 h-[26px]">
        <div className="flex flex-row items-center gap-2">
          <BaseLogo className="w-[60px] h-[15px]" />
          <span className="text-gray-400 text-sm">×</span>
          <PrivyLogo className="w-[80px] h-[18px]" />
        </div>

        <div className="text-medium flex h-[22px] items-center justify-center rounded-[11px] border border-primary px-[0.375rem] text-[0.75rem] text-primary">
          Base × Privy Demo
        </div>
      </div>

      <div className="flex flex-row justify-end items-center gap-4 h-9">
        <a
          className="text-primary flex flex-row items-center gap-1 cursor-pointer"
          href="https://docs.base.org/base-account/overview"
          target="_blank"
          rel="noreferrer"
        >
          Base Account Docs <ArrowUpRightIcon className="h-4 w-4" strokeWidth={2} />
        </a>
        
        <a
          className="text-primary flex flex-row items-center gap-1 cursor-pointer"
          href="https://docs.privy.io/basics/react/installation"
          target="_blank"
          rel="noreferrer"
        >
          Privy Docs <ArrowUpRightIcon className="h-4 w-4" strokeWidth={2} />
        </a>

        <button className="button-primary rounded-full hidden md:block">
          <a
            className="flex flex-row items-center gap-2"
            href="https://dashboard.privy.io/"
            target="_blank"
            rel="noreferrer"
          >
            <span> Go to dashboard</span>
            <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
          </a>
        </button>
      </div>
    </header>
  );
}
