import { redirect } from "next/navigation";

const defaultMessage =
  "The page you're trying to reach doesn't exist or may have been moved.";

export default function CatchAllNotFound() {
  const params = new URLSearchParams({
    code: "404",
    title: "Page not found",
    message: defaultMessage,
  });

  redirect(`/not-found?${params.toString()}`);
}
