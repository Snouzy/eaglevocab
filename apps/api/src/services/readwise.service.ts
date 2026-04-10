import { logger } from "../helpers/logger";

export interface ReadwiseBook {
  id: number;
  title: string;
  author: string;
  coverImageUrl: string | null;
}

export interface ReadwiseHighlight {
  id: number;
  text: string;
  highlightedAt: string;
}

interface ReadwiseBooksResponse {
  results: Array<{
    id: number;
    title: string;
    author: string;
    cover_image_url: string | null;
  }>;
  next: string | null;
}

interface ReadwiseHighlightsResponse {
  results: Array<{
    id: number;
    text: string;
    highlighted_at: string;
    color: string;
  }>;
  next: string | null;
}

export const verifyReadwiseToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch("https://readwise.io/api/v2/auth/", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.status === 204;
  } catch (error) {
    logger.error("Readwise token verification error", error);
    return false;
  }
};

export const fetchReadwiseBooks = async (token: string): Promise<ReadwiseBook[]> => {
  const books: ReadwiseBook[] = [];
  let nextUrl: string | null = "https://readwise.io/api/v2/books/?category=books&page_size=100";

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Readwise API error: ${response.status}`);
      }

      const data: ReadwiseBooksResponse = await response.json();

      const pageBooks = (data.results || []).map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        coverImageUrl: item.cover_image_url,
      }));

      books.push(...pageBooks);
      nextUrl = data.next;
    }

    return books;
  } catch (error) {
    logger.error("Fetch Readwise books error", error);
    throw error;
  }
};

export const fetchReadwiseHighlights = async (
  token: string,
  bookId: number
): Promise<ReadwiseHighlight[]> => {
  const highlights: ReadwiseHighlight[] = [];
  let nextUrl: string | null = `https://readwise.io/api/v2/highlights/?book_id=${bookId}&page_size=1000`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Readwise API error: ${response.status}`);
      }

      const data: ReadwiseHighlightsResponse = await response.json();

      const pageHighlights = (data.results || [])
        .filter((item) => item.color === "orange")
        .map((item) => ({
          id: item.id,
          text: item.text,
          highlightedAt: item.highlighted_at,
        }));

      highlights.push(...pageHighlights);
      nextUrl = data.next;
    }

    return highlights;
  } catch (error) {
    logger.error("Fetch Readwise highlights error", error);
    throw error;
  }
};
