import type { AnchorHTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import { Link, useLocation } from "react-router";
import { scrollToTarget } from "../../lib/scroll";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children: ReactNode;
  onNavigate?: () => void;
  ref?: Ref<HTMLAnchorElement>;
};

/** Links to a home-page section; on the home page it smooth-scrolls instead of navigating. */
export default function SectionLink({
  to,
  children,
  onNavigate,
  onClick,
  ...rest
}: Props) {
  const { pathname } = useLocation();
  const isTop = to === "#top";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    onNavigate?.();
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;
    if (pathname !== "/" || event.defaultPrevented || modified) return;
    event.preventDefault();
    scrollToTarget(isTop ? 0 : to);
  };

  return (
    <Link
      to={{ pathname: "/", hash: isTop ? "" : to }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}
