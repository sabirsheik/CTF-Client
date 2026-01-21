import { Suspense, type ComponentType } from "react";
import { Loading } from "../Loading/Loading";

interface LazyRouteProps {
  component: ComponentType<any>;
  [key: string]: any;
}

export const LazyRoute = ({ component: Component, ...props }: LazyRouteProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};
