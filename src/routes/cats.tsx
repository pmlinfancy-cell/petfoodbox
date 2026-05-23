import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/cats")({
  component: CatsLayout,
});

function CatsLayout() {
  return <Outlet />;
}
