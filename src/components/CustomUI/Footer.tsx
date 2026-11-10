import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border dark:border-border-dark mt-auto">
      <div className="mx-auto flex w-full max-w-[1024px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-8 text-sm text-muted dark:text-muted-dark">
        <span>CoinBrief</span>
        <div className="flex items-center gap-6">
          <a
            className="transition-colors hover:text-ink dark:hover:text-ink-dark"
            target="_blank"
            rel="noreferrer"
            href="https://www.figma.com/design/xxO2ItVjjcXe3QsYKTmkPR/coin_project?node-id=4-2&p=f&t=DBAnGhVx8fhAQNCT-0"
          >
            Figma
          </a>
          <a
            className="transition-colors hover:text-ink dark:hover:text-ink-dark"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/nile27/CoinBrief"
          >
            Github
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
