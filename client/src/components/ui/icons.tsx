import { SVGProps } from "react";

export function HerbalMedicinePotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Stylized Korean Medicine Pot */}
      <path d="M6 19h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M8 12h8" />
      <path d="M12 16V8" />
    </svg>
  );
}

export function HerbalLeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Stylized Herbal Leaf */}
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.5 0 1-.04 1.5-.1" />
      <path d="M8 11c2-2 4-4 6-2s4 4 2 6-4 4-6 2-4-4-2-6z" />
      <path d="M12 2c5.5 0 10 4.5 10 10 0 .5-.04 1-.1 1.5" />
    </svg>
  );
}
