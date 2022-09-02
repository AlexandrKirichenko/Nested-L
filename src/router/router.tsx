import { FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { authSlice } from '../store/auth';
import { routeList, routeNameList } from './routeList';
import { RedirectExecutor } from './RedirectExecutor';
import { getRoutePath } from './helpers';

export const Router: FC = () => {
  const isAuth = useAppSelector(authSlice.selectors.getIsAuth);

  return (
    <>
      <Routes>
        {routeNameList.map((routeName) => {
          const route = routeList[routeName];
          if (route.isPrivate && !isAuth) {
            return (
              <Route
                path={route.path}
                key={routeName}
                element={<Navigate to={getRoutePath('LoginPage')} />}
              />
            );
          }

          if (route.isNotInPrivate && isAuth) {
            return (
              <Route
                path={route.path}
                key={routeName}
                element={<Navigate to={getRoutePath('ListFeaturePage')} />}
              />
            );
          }

          return <Route path={route.path} key={routeName} element={<route.component />} />;
        })}
      </Routes>
      <RedirectExecutor />
    </>
  );
};
