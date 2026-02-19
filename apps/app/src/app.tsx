import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AuthGuard } from "@/components/auth-guard";
import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { StudyLayout } from "@/layouts/study-layout";
import { SignInPage } from "@/pages/sign-in";
import { SignUpPage } from "@/pages/sign-up";
import { DashboardPage } from "@/pages/dashboard";
import { DecksPage } from "@/pages/decks";
import { DeckDetailPage } from "@/pages/deck-detail";
import { BooksPage } from "@/pages/books";
import { BookDetailPage } from "@/pages/book-detail";
import { CardsPage } from "@/pages/cards";
import { NewCardPage } from "@/pages/new-card";
import { SettingsPage } from "@/pages/settings";
import { StudyPage } from "@/pages/study";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
    ],
  },
  {
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/decks", element: <DecksPage /> },
      { path: "/decks/:deckId", element: <DeckDetailPage /> },
      { path: "/books", element: <BooksPage /> },
      { path: "/books/:bookId", element: <BookDetailPage /> },
      { path: "/cards", element: <CardsPage /> },
      { path: "/cards/new", element: <NewCardPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  {
    element: (
      <AuthGuard>
        <StudyLayout />
      </AuthGuard>
    ),
    children: [{ path: "/study/:deckId", element: <StudyPage /> }],
  },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
