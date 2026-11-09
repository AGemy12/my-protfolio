import Image, { type ImageProps } from "next/image";

const optimizable = (src: string) => src.startsWith("/") || /\.public\.blob\.vercel-storage\.com\//.test(src);

/** next/image that skips optimization for arbitrary external URLs pasted in the dashboard. */
export function SmartImage({ src, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} unoptimized={!optimizable(src)} {...props} />;
}
