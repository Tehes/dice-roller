/* --------------------------------------------------------------------------------------------------
 * Generic Service Worker template
 * - Per project cache namespace based on PROJECT_SLUG
 * - Cleans up only this project's SW caches
 -------------------------------------------------------------------------------------------------- */

/**
 * slug must follow the exact same logic used on the client:
 * - GitHub Pages (user.github.io/project/...) -> slug = the first path segment (the project folder name)
 * - All other hosts (localhost, custom domains, etc.): slug = hostname
 */
function getProjectSlugFromSW() {
	const scopeUrl = new URL(self.registration.scope);
	const hostname = scopeUrl.hostname;
	const pathParts = scopeUrl.pathname.split("/").filter(Boolean);

	const isGitHubPages = hostname.endsWith("github.io");

	if (isGitHubPages && pathParts.length > 0) {
		return pathParts[0].toLowerCase();
	}

	return hostname.replace(/[^\w-]/g, "_").toLowerCase();
}

const PROJECT_SLUG = getProjectSlugFromSW();
const VERSION = new URL(self.location).searchParams.get("v") || "default";
const CACHE_PREFIX = `${PROJECT_SLUG}-cache-`;
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;

// Define allowed origins for caching
const ALLOWED_ORIGINS = new Set([
	self.location.origin,
	"https://fonts.googleapis.com",
	"https://fonts.gstatic.com",
]);

// Adjust these paths for each project; a missing file prevents installation.
const APP_SHELL = [
	"./",
	"./index.html",
	"./css/style.css",
	"./js/app.js",
	"./js/service-worker-registration.js",
].map((path) => new URL(path, self.registration.scope).href);

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => cache.addAll(APP_SHELL))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("message", (event) => {
	if (event?.data?.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

// Use fresh app files online and cached copies when offline.
self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") {
		return;
	}

	const requestUrl = new URL(event.request.url);

	if (!ALLOWED_ORIGINS.has(requestUrl.origin)) {
		return;
	}

	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const cached = await cache.match(event.request);

			if (requestUrl.origin !== self.location.origin && cached) {
				return cached;
			}

			try {
				const response = await fetch(event.request);

				if (response.ok || response.type === "opaque") {
					try {
						await cache.put(event.request, response.clone());
					} catch (error) {
						console.warn("Service Worker cache write failed:", error);
					}
				}

				return response;
			} catch (error) {
				if (cached) {
					return cached;
				}

				throw error;
			}
		}),
	);
});

// Clean up old caches for this project only
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((names) =>
				Promise.all(
					names
						.filter((name) => {
							// only caches of this project
							if (!name.startsWith(CACHE_PREFIX)) return false;
							// keep current cache
							if (name === CACHE_NAME) return false;
							// never touch data caches like "<slug>-data-cache"
							if (name.includes("-data-cache")) return false;
							return true;
						})
						.map((name) => caches.delete(name)),
				)
			),
	);
	event.waitUntil(self.clients.claim());
});
