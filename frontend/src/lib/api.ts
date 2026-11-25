export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // When running in production browser (like *.vercel.app), use relative '/api'
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('fs_auth_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const apiBase = getApiBase();
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    // If localhost:4000 is unreachable, gracefully fall back to Next.js internal /api route
    if (typeof window !== 'undefined' && apiBase.startsWith('http://localhost')) {
      const fallbackUrl = `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      response = await fetch(fallbackUrl, {
        ...options,
        headers,
      });
    } else {
      throw networkErr;
    }
  }

  if (!response.ok) {
    let errorMsg = `API Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Settings
  getPublicSettings: () => fetchApi('/settings/public'),
  getAllSettings: () => fetchApi('/settings/all'),
  updateSettings: (settings: any[]) => fetchApi('/settings/update', { method: 'POST', body: JSON.stringify({ settings }) }),

  // Inventory
  getCategories: () => fetchApi('/inventory/categories'),
  getItems: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    });
    return fetchApi(`/inventory/items?${qs.toString()}`);
  },
  getItem: (idOrSlug: string) => fetchApi(`/inventory/items/${idOrSlug}`),
  createItem: (data: any) => fetchApi('/inventory/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: any) => fetchApi(`/inventory/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: string) => fetchApi(`/inventory/items/${id}`, { method: 'DELETE' }),

  // AI Generation
  generateImage: (data: { itemIds: string[]; prompt?: string; instructions?: string; visualTheme?: string; aspectRatio?: string }) =>
    fetchApi('/ai/generate-image', { method: 'POST', body: JSON.stringify(data) }),
  generateVideo: (data: { itemIds: string[]; instructions?: string; visualTheme?: string; durationSeconds?: number }) =>
    fetchApi('/ai/generate-video', { method: 'POST', body: JSON.stringify(data) }),
  getAiStatus: (id: string) => fetchApi(`/ai/status/${id}`),
  getAiHistory: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchApi(`/ai/history?${qs}`);
  },
  regenerateAi: (id: string) => fetchApi(`/ai/regenerate/${id}`, { method: 'POST' }),
  chatConcierge: (data: { message: string; history?: any[]; customerInfo?: any }) =>
    fetchApi('/ai/chat', { method: 'POST', body: JSON.stringify(data) }),

  // Invitations
  getTemplates: () => fetchApi('/invitations/templates'),
  getTemplate: (idOrSlug: string) => fetchApi(`/invitations/templates/${idOrSlug}`),
  createInvitation: (data: any) => fetchApi('/invitations/create', { method: 'POST', body: JSON.stringify(data) }),
  getInvitation: (slug: string) => fetchApi(`/invitations/view/${slug}`),
  submitRsvp: (slug: string, rsvp: any) => fetchApi(`/invitations/rsvp/${slug}`, { method: 'POST', body: JSON.stringify(rsvp) }),

  // Inquiries
  submitInquiry: (data: any) => fetchApi('/inquiries/submit', { method: 'POST', body: JSON.stringify(data) }),
  getInquiries: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchApi(`/inquiries?${qs}`);
  },
  getInquiry: (id: string) => fetchApi(`/inquiries/${id}`),
  updateInquiryStatus: (id: string, status: string, notes?: string) =>
    fetchApi(`/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),

  // Bookings
  createBooking: (data: any) => fetchApi('/bookings/create', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetchApi(`/bookings?${qs}`);
  },
  getBooking: (id: string) => fetchApi(`/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, paymentStatus?: string) =>
    fetchApi(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, paymentStatus }) }),

  // Analytics
  getDashboardKpis: () => fetchApi('/analytics/dashboard'),

  // Auth
  login: (credentials: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => fetchApi('/auth/profile'),

  // Services
  getServices: () => fetchApi('/services'),
  getAllServicesAdmin: () => fetchApi('/services/all'),
  createService: (data: any) => fetchApi('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => fetchApi(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => fetchApi(`/services/${id}`, { method: 'DELETE' }),

  // Portfolio
  getPortfolio: (cat?: string) => fetchApi(`/portfolio${cat ? `?category=${cat}` : ''}`),
  getAllPortfolioAdmin: () => fetchApi('/portfolio/all'),
  createPortfolioProject: (data: any) => fetchApi('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
  updatePortfolioProject: (id: string, data: any) => fetchApi(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePortfolioProject: (id: string) => fetchApi(`/portfolio/${id}`, { method: 'DELETE' }),

  // Categories & Subcategories
  createCategory: (data: any) => fetchApi('/inventory/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetchApi(`/inventory/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchApi(`/inventory/categories/${id}`, { method: 'DELETE' }),

  // Templates Management
  createTemplate: (data: any) => fetchApi('/invitations/templates', { method: 'POST', body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) => fetchApi(`/invitations/templates/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  deleteTemplate: (id: string) => fetchApi(`/invitations/templates/delete/${id}`),

  // SEO & OpenGraph Settings
  getSeoSettings: () => fetchApi('/settings/seo'),
  updateSeoSettings: (data: any) => fetchApi('/settings/seo', { method: 'POST', body: JSON.stringify(data) }),

  // Integrations
  getZohoConfig: () => fetchApi('/zoho/config'),
  updateZohoConfig: (data: any) => fetchApi('/zoho/config', { method: 'POST', body: JSON.stringify(data) }),
  syncZohoLead: (inquiryId: string) => fetchApi(`/zoho/sync-lead/${inquiryId}`, { method: 'POST' }),
  getWhatsAppConfig: () => fetchApi('/whatsapp/config'),
  updateWhatsAppConfig: (data: any) => fetchApi('/whatsapp/config', { method: 'POST', body: JSON.stringify(data) }),
  sendWhatsAppMessage: (data: any) => fetchApi('/whatsapp/send-message', { method: 'POST', body: JSON.stringify(data) }),
  getWhatsAppLogs: () => fetchApi('/whatsapp/logs'),
};

