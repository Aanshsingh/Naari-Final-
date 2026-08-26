import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/layout";
import Home from "../Component/pages/home/Home.jsx";
import AuthScreen from "../Component/pages/auth/AuthScreen";
import ProductDetail from "../Component/pages/ProductDetail/ProductsScreen.jsx";
import Cart from "../Component/pages/cartPage.jsx";
import ProtectedRoute from "../Component/common/ProtectedRoute.jsx";
import Checkout from "../Component/pages/Checkout.jsx";
import Search from "../Component/common/SearchBar.jsx";
import OrderConfirmation from "../Component/pages/orderCinformation.jsx";
import Account from "../Component/pages/Acount.jsx";
import Shop from "../Component/pages/Shop.jsx";
import Orders from "../Component/pages/Order.jsx";
import OrderDetail from "../Component/pages/OrderDetail.jsx";
import Wishlist from "../Component/pages/Wishlist.jsx";
import Contact from "../Component/pages/Contact.jsx";
import About from "../Component/pages/About.jsx";
import VerifyEmail from "../Component/pages/VerifyEmail.jsx";
import TermsOfService from "../Component/pages/TermsOfService.jsx";
import PrivacyPolicy from "../Component/pages/PrivacyPolicy.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "auth", element: <AuthScreen /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },

      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "Search",
        element: <Search />,
      },
      // { path: "User", element: <User /> },
      {
        path: "order-confirmation/:orderId",
        element: (
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        ),
      },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      { path: "shop", element: <Shop /> },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        ),
      },
      { path: "wishlist", element: <Wishlist /> },
      {path: "Contact", element: <Contact/> },
      {path:"About", element: <about/>},
      { path: "verify-email/:token", element: <VerifyEmail /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "privacy", element: <PrivacyPolicy /> },


    ],
  },
]);

export default Router;

