import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
        d="M168 88.00005h48m-48-32h48"
      />
      <path
        d="M216 40.00005v128a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8v-128a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
      />
      <path
        d="M152 216.00005h-24a8 8 0 0 1-8-8v-48a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8Zm-56-128h-48m48 32h-48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
      />
      <path
        d="M96 88.00005v128a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-128a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={16}
      />
    </svg>
  );
}
