export type TransitionRequest = {
  rect: DOMRect;
  color: string;
  href: string;
};

type Handler = (req: TransitionRequest) => void;

let handler: Handler | null = null;

/** Tiny bridge between <TransitionLink> and the global <RouteTransition>. */
export const routeTransition = {
  register(h: Handler) {
    handler = h;
    return () => {
      if (handler === h) handler = null;
    };
  },
  start(req: TransitionRequest) {
    if (handler) {
      handler(req);
      return true;
    }
    return false;
  },
};

/**
 * onClick handler for "case study" links that live in a separate React root
 * (3D screens): no router context there, so go through the page transition.
 * Falls back to a normal navigation when the transition isn't mounted.
 */
export function caseStudyClick(href: string, color = "#ff5b2e") {
  return (e: {
    currentTarget: Element;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    button: number;
    preventDefault: () => void;
  }) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (routeTransition.start({ rect, color, href })) e.preventDefault();
  };
}
