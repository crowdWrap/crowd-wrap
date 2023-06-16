import { Navigate, Outlet, useParams } from "react-router-dom";

export default function InnerProtection({ children }: any) {
  const { id } = useParams();
  const dashIndex: any = id?.lastIndexOf("-");
  const eventId: any = id?.substring(dashIndex + 1);

  const pattern = /^[0-9]+$/;
  if (!pattern.test(eventId)) {
    return <Navigate to="/events" />;
  }

  return children;
}
