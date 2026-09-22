import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OrderListProvider } from '@/context/OrderListContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { TransitionProvider } from '@/components/motion/PageTransition';
import { Layout } from '@/components/layout/Layout';
import { NotFoundPage, routes } from '@/routes';

/**
 * Provider order matters:
 *   Router → OrderList + Wishlist (state) → Transition (needs router hooks; renders the curtain)
 *   → Routes (Layout shell wraps every page).
 * Pages are lazy and code-split; the route table lives in routes.jsx.
 */
export default function App() {
  return (
    <BrowserRouter>
      <OrderListProvider>
        <WishlistProvider>
          <TransitionProvider>
            <Routes>
              <Route element={<Layout />}>
                {routes.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </TransitionProvider>
        </WishlistProvider>
      </OrderListProvider>
    </BrowserRouter>
  );
}
