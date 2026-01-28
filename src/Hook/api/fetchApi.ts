const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// Fetch options interface
interface FetchOptions extends RequestInit {
  body?: any;
}
// Generic API fetch function
const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  // Construct full URL
  const url = `${API_BASE_URL}${endpoint}`;

  const bodyIsFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  //  Configure fetch options
  const config: RequestInit = {
    credentials: "include",
    headers: {
      ...(bodyIsFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  };
  // Stringify body if it's an object
  if (config.body && typeof config.body === "object" && !bodyIsFormData) {
    config.body = JSON.stringify(config.body);
  }
  // Make the fetch call
  const response = await fetch(url, config);
  // Handle non-OK responses
  if (!response.ok) {
    // For user endpoint, return null on 401 instead of throwing
    if (endpoint === "/api/auth/user" && response.status === 401) {
      return null;
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: "Something went wrong" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};
export default apiFetch;