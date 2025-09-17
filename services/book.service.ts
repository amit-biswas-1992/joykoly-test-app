import { apiClient } from './api-client';
import { cacheService } from './cache.service';

export interface Book {
  id: string;
  title: string;
  description?: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedDate?: string;
  price: number;
  discountPrice: number;
  category?: string;
  language?: string;
  pages?: number;
  tags?: string[];
  coverImageUrl?: string;
  pdfUrl?: string;
  format?: string;
  linkType: 'internal' | 'external';
  externalUrl?: string;
  thumbnail?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  rating?: number;
  totalReviews?: number;
}

const API_ENDPOINTS = {
  books: {
    list: '/api/v1/books',
    detail: (id: string) => `/api/v1/books/${id}`,
    top: '/api/v1/books/top',
    category: (category: string) => `/api/v1/books/category/${category}`,
    search: '/api/v1/books/search',
  },
};

const mapApiBookToBook = (apiBook: any): Book => {
  return {
    id: apiBook.id,
    title: apiBook.title,
    description: apiBook.description,
    author: apiBook.author,
    isbn: apiBook.isbn,
    publisher: apiBook.publisher,
    publishedDate: apiBook.publishedDate,
    price: parseFloat(apiBook.price || '0'),
    discountPrice: parseFloat(apiBook.discountPrice || apiBook.price || '0'),
    category: apiBook.category,
    language: apiBook.language,
    pages: apiBook.pages,
    tags: apiBook.tags,
    coverImageUrl: apiBook.coverImageUrl || apiBook.thumbnail,
    pdfUrl: apiBook.pdfUrl,
    format: apiBook.format,
    linkType: apiBook.linkType || 'internal',
    externalUrl: apiBook.externalUrl,
    thumbnail: apiBook.thumbnail || apiBook.coverImageUrl,
    isAvailable: apiBook.isAvailable !== false,
    isFeatured: apiBook.isFeatured || false,
    rating: parseFloat(apiBook.rating || '0'),
    totalReviews: apiBook.totalReviews || 0,
  };
};

const getMockBooks = (): Book[] => {
  return [
    {
      id: '1',
      title: 'জয়কলি - HSC Physics',
      description: 'Complete physics guide for HSC students with detailed explanations and practice problems. This comprehensive textbook covers all major physics topics including mechanics, thermodynamics, waves, and modern physics.',
      author: 'Joykoly Team',
      price: 500,
      discountPrice: 400,
      category: 'HSC',
      language: 'Bengali',
      pages: 320,
      coverImageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/books/physics-hsc.webp',
      format: 'Paperback',
      linkType: 'external',
      externalUrl: 'https://joykolyacademy.com/books/hsc-physics',
      isAvailable: true,
      isFeatured: true,
      rating: 4.8,
      totalReviews: 150,
    },
    {
      id: '2',
      title: 'জয়কলি - HSC Chemistry',
      description: 'Comprehensive chemistry textbook for HSC students with practical examples. Covers organic, inorganic, and physical chemistry with detailed explanations and laboratory procedures.',
      author: 'Joykoly Team',
      price: 450,
      discountPrice: 360,
      category: 'HSC',
      language: 'Bengali',
      pages: 280,
      coverImageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/books/chemistry-hsc.webp',
      format: 'Paperback',
      linkType: 'external',
      externalUrl: 'https://joykolyacademy.com/books/hsc-chemistry',
      isAvailable: true,
      isFeatured: true,
      rating: 4.7,
      totalReviews: 120,
    },
    {
      id: '3',
      title: 'জয়কলি - HSC Mathematics',
      description: 'Complete mathematics guide with step-by-step solutions and practice exercises. Includes calculus, algebra, geometry, and statistics with detailed problem-solving techniques.',
      author: 'Joykoly Team',
      price: 600,
      discountPrice: 480,
      category: 'HSC',
      language: 'Bengali',
      pages: 400,
      coverImageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/books/mathematics-hsc.webp',
      format: 'Paperback',
      linkType: 'external',
      externalUrl: 'https://joykolyacademy.com/books/hsc-mathematics',
      isAvailable: true,
      isFeatured: false,
      rating: 4.9,
      totalReviews: 200,
    },
    {
      id: '4',
      title: 'জয়কলি - Admission Test Guide',
      description: 'Complete guide for university admission tests with previous year questions. Covers all major universities including DU, JU, RU, CU, BUET, and medical colleges.',
      author: 'Joykoly Team',
      price: 700,
      discountPrice: 560,
      category: 'Admission',
      language: 'Bengali',
      pages: 500,
      coverImageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/books/admission-guide.webp',
      format: 'Paperback',
      linkType: 'external',
      externalUrl: 'https://joykolyacademy.com/books/admission-test-guide',
      isAvailable: true,
      isFeatured: false,
      rating: 4.6,
      totalReviews: 80,
    },
  ];
};

export const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const cacheKey = 'all_books';
    
    // Check cache first
    const cachedData = cacheService.get<Book[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await apiClient.fetch(API_ENDPOINTS.books.list);
      const books = Array.isArray(response) ? response : (response as any)?.data || [];
      
      let result: Book[];
      
      if (books.length === 0) {
        result = getMockBooks();
      } else {
        result = books.map(mapApiBookToBook);
      }
      
      // Cache the result
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching all books:', error);
      const result = getMockBooks();
      cacheService.set(cacheKey, result);
      return result;
    }
  },

  getTopBooks: async (limit: number = 4): Promise<Book[]> => {
    try {
      const endpoint = limit ? `${API_ENDPOINTS.books.top}?limit=${limit}` : API_ENDPOINTS.books.top;
      const response = await apiClient.fetch(endpoint);
      const books = Array.isArray(response) ? response : (response as any)?.data || [];
      
      if (books.length === 0) {
        return getMockBooks().slice(0, limit);
      }
      
      return books.map(mapApiBookToBook);
    } catch (error) {
      console.error('Error fetching top books:', error);
      return getMockBooks().slice(0, limit);
    }
  },

  getFeaturedBooks: async (): Promise<Book[]> => {
    const cacheKey = 'featured_books';
    
    // Check cache first
    const cachedData = cacheService.get<Book[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const books = await bookService.getAllBooks();
      const result = books.filter(book => book.isFeatured).slice(0, 3);
      
      // Cache the result
      cacheService.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching featured books:', error);
      const result = getMockBooks().filter(book => book.isFeatured).slice(0, 3);
      cacheService.set(cacheKey, result);
      return result;
    }
  },

  getBookById: async (id: string): Promise<Book | null> => {
    try {
      const response = await apiClient.fetch(API_ENDPOINTS.books.detail(id));
      const book = (response as any)?.data || response;
      
      if (book && book.id) {
        return mapApiBookToBook(book);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching book by id:', error);
      return null;
    }
  },

  getBooksByCategory: async (category: string): Promise<Book[]> => {
    try {
      const response = await apiClient.fetch(API_ENDPOINTS.books.category(category));
      const books = Array.isArray(response) ? response : (response as any)?.data || [];
      
      if (books.length === 0) {
        return getMockBooks().filter(book => book.category === category);
      }
      
      return books.map(mapApiBookToBook);
    } catch (error) {
      console.error('Error fetching books by category:', error);
      return getMockBooks().filter(book => book.category === category);
    }
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    try {
      const endpoint = `${API_ENDPOINTS.books.search}?q=${encodeURIComponent(query)}`;
      const response = await apiClient.fetch(endpoint);
      const books = Array.isArray(response) ? response : (response as any)?.data || [];
      
      if (books.length === 0) {
        return getMockBooks().filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return books.map(mapApiBookToBook);
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  },
};
