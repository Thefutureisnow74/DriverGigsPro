import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function fetchCsrfToken(): Promise<string> {
  try {
    const res = await fetch('/api/auth/csrf-token', {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    
    const data = await res.json();
    return data.csrfToken;
  } catch (error) {
    console.error('[CSRF] Error fetching token:', error);
    return '';
  }
}

// Helper function for file uploads with CSRF protection
export async function uploadFiles(
  url: string,
  files: FileList | File[],
  fieldName: string = 'files',
  additionalData?: Record<string, string>
): Promise<Response> {
  console.log('[uploadFiles] Starting upload:', { 
    url, 
    filesInput: files, 
    filesType: files?.constructor?.name,
    filesLength: files?.length,
    fieldName, 
    additionalData 
  });
  
  const csrfToken = await fetchCsrfToken();
  const formData = new FormData();
  
  // Append files
  const fileArray = Array.isArray(files) ? files : Array.from(files);
  console.log('[uploadFiles] File array:', { 
    count: fileArray.length, 
    files: fileArray.map(f => ({ name: f.name, size: f.size, type: f.type }))
  });
  
  fileArray.forEach((file, index) => {
    console.log(`[uploadFiles] Appending file ${index}:`, file.name, file.size, 'bytes');
    formData.append(fieldName, file);
  });
  
  // Append additional data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }
  
  // Log FormData contents
  console.log('[uploadFiles] FormData entries:');
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  });
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'x-csrf-token': csrfToken,
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }
  
  return response;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Enhanced error logging for debugging
    console.error('[API ERROR]', {
      method: res.url,
      status: res.status,
      statusText: res.statusText,
      body: text,
      url: res.url
    });
    
    // Check if the response is HTML (common when hitting wrong endpoints)
    if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
      throw new Error(`${res.status}: Server returned HTML instead of JSON. This usually means you're hitting the wrong endpoint. Please refresh and try again.`);
    }
    
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
  }
): Promise<Response> {
  const { method = "GET", body } = options || {};
  
  // Build SAME-ORIGIN URL so HTTPS page never calls HTTP localhost
  const fullUrl = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`;
  
  // SAVE-SERVICE-CHECK as requested - verify shared pipeline usage
  if (method !== 'GET') {
    console.log('[SAVE-SERVICE-CHECK]', true, { 
      originalPath: path,
      fullUrl, 
      method, 
      keys: body ? Object.keys(body as Record<string, any>) : []
    });
    console.log('[API REQUEST]', {
      method,
      originalPath: path,
      fullUrl,
      bodyKeys: body ? Object.keys(body as Record<string, any>) : [],
      body: body
    });
  }
  
  // Get CSRF token for non-GET requests
  const csrfToken = method !== 'GET' ? await fetchCsrfToken() : '';
  
  const res = await fetch(fullUrl, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      ...(options?.body ? {} : {})
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Make HTML "200" from a catch-all obvious
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  
  // 204 No Content is a valid success response with no body
  if (res.status === 204) {
    return {
      ...res,
      json: async () => ({}),
      text: async () => ''
    } as Response;
  }
  
  if (!res.ok || !contentType.includes('application/json')) {
    console.error('[API ERROR]', { 
      url: fullUrl, 
      status: res.status, 
      contentType, 
      body: text.slice(0, 180) 
    });
    throw new Error(`[${res.status}] Non-JSON or network error`);
  }
  
  // Return a response-like object for compatibility
  return {
    ...res,
    json: async () => JSON.parse(text),
    text: async () => text
  } as Response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
      retry: 1,
      retryDelay: 1000,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
